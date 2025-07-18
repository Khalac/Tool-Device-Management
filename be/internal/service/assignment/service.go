package service

import (
	"BE_Manage_device/internal/domain/dto"
	"BE_Manage_device/internal/domain/entity"
	"BE_Manage_device/internal/domain/filter"
	"BE_Manage_device/pkg/utils"

	asset_log "BE_Manage_device/internal/repository/asset_log"
	asset "BE_Manage_device/internal/repository/assets"
	assignment "BE_Manage_device/internal/repository/assignments"
	department "BE_Manage_device/internal/repository/departments"
	user "BE_Manage_device/internal/repository/user"
	notificationS "BE_Manage_device/internal/service/notification"

	"fmt"
	"time"
)

type AssignmentService struct {
	Repo                assignment.AssignmentRepository
	assetLogRepo        asset_log.AssetsLogRepository
	assetRepo           asset.AssetsRepository
	departmentRepo      department.DepartmentsRepository
	userRepo            user.UserRepository
	NotificationService *notificationS.NotificationService
}

func NewAssignmentService(repo assignment.AssignmentRepository, assetLogRepo asset_log.AssetsLogRepository, assetRepo asset.AssetsRepository, departmentRepo department.DepartmentsRepository, userRepo user.UserRepository, NotificationService *notificationS.NotificationService) *AssignmentService {
	return &AssignmentService{Repo: repo, assetLogRepo: assetLogRepo, assetRepo: assetRepo, departmentRepo: departmentRepo, userRepo: userRepo, NotificationService: NotificationService}
}

func (service *AssignmentService) Create(userIdAssign, departmentId *int64, userId, assetId int64) (*entity.Assignments, error) {
	var err error
	assignment := entity.Assignments{
		UserId:       userIdAssign,
		AssetId:      assetId,
		AssignBy:     userId,
		DepartmentId: departmentId,
	}
	tx := service.Repo.GetDB().Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			panic(r)
		} else if err != nil {
			tx.Rollback()
		}
	}()
	assignmentCreated, err := service.Repo.Create(&assignment, tx)
	if err != nil {
		return nil, err
	}
	tx.Commit()
	return assignmentCreated, err
}

func (service *AssignmentService) Update(userId, assignmentId int64, userIdAssign, departmentId *int64) (*entity.Assignments, error) {
	var err error
	assignment, err := service.Repo.GetAssignmentById(assignmentId)
	if err != nil {
		return nil, err
	}
	byUser, err := service.userRepo.FindByUserId(userId)
	if err != nil {
		return nil, err
	}
	var assignUser *entity.Users
	asset, err := service.assetRepo.GetAssetById(assignment.AssetId)
	if err != nil {
		return nil, err
	}
	if asset.Status == "Under Maintenance" {
		return nil, fmt.Errorf("The asset is under maintenance.")
	}
	assetOwnerRole := asset.OnwerUser.Role.Slug
	var assignedUserRole string
	if userIdAssign != nil {
		assignUser, err = service.userRepo.FindByUserId(*userIdAssign)
		if err != nil {
			return nil, err
		}
		assignedUserRole = assignUser.Role.Slug
	} else {
		assignUser, err = service.userRepo.GetUserAssetManageOfDepartment(*departmentId)
		if err != nil {
			return nil, err
		}
	}
	const (
		RoleEmployee = "employee"
		RoleManager  = "assetManager"
		RoleAdmin    = "admin"
	)
	permissionErrorMessage := fmt.Errorf("You are not allowed to assign this user or department.")
	if byUser.CompanyId != asset.CompanyId {
		return nil, permissionErrorMessage
	}
	if (assignUser != nil) && (assignUser.CompanyId != asset.CompanyId) {
		return nil, permissionErrorMessage
	}
	if departmentId != nil {
		department, err := service.departmentRepo.GetDepartmentById(*departmentId)
		if err != nil {
			return nil, err
		}
		if department.CompanyId != asset.CompanyId {
			return nil, permissionErrorMessage
		}
	}
	switch byUser.Role.Slug {
	case RoleAdmin:
		if assetOwnerRole != RoleManager {
			return nil, permissionErrorMessage
		}
		if (userIdAssign != nil) && (assignedUserRole != RoleManager) {
			return nil, permissionErrorMessage
		}
	case RoleManager:
		if (assetOwnerRole == RoleAdmin) || ((userIdAssign != nil) && (assignedUserRole == RoleAdmin)) {
			return nil, permissionErrorMessage
		}
		if *asset.OnwerUser.DepartmentId != *byUser.DepartmentId {
			return nil, permissionErrorMessage
		}
		if (userIdAssign != nil) && (*assignUser.DepartmentId != *asset.OnwerUser.DepartmentId) && (assignedUserRole == RoleEmployee) {
			return nil, permissionErrorMessage
		}
	case RoleEmployee:
		if *asset.Owner != userId {
			return nil, permissionErrorMessage
		}
		if userIdAssign == nil {
			return nil, permissionErrorMessage
		}
		if (*asset.OnwerUser.DepartmentId != *assignUser.DepartmentId) || (assignUser.Role.Slug != RoleEmployee) {
			return nil, permissionErrorMessage
		}
	default:
		return nil, fmt.Errorf("Unauthorized role to perform assignment")
	}
	tx := service.Repo.GetDB().Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			panic(r)
		} else if err != nil {
			tx.Rollback()
		}
	}()
	var assignmentUpdated *entity.Assignments
	assignmentUpdated, err = service.Repo.Update(assignmentId, userId, assignment.AssetId, &assignUser.Id, assignUser.DepartmentId, tx)
	if err != nil {
		return nil, err
	}

	// Chuyển phòng ban
	if departmentId != nil {
		assetLog := entity.AssetLog{
			Timestamp: time.Now(),
			Action:    "Transfer",
			AssetId:   asset.Id,
			ByUserId:  &byUser.Id,
			CompanyId: byUser.CompanyId,
		}
		assetLog.AssignUserId = &assignUser.Id
		department, err := service.departmentRepo.GetDepartmentById(*departmentId)
		if err != nil {
			return nil, err
		}
		assetLog.ChangeSummary = fmt.Sprintf("Transfer from department %v to department %v by user %v\n",
			asset.Department.DepartmentName, department.DepartmentName, byUser.Email)
		if err := service.assetRepo.UpdateOwner(assignment.AssetId, assignUser.Id, tx); err != nil {
			return nil, err
		}
		if _, err := service.assetRepo.UpdateAssetDepartment(assignment.AssetId, *departmentId, tx); err != nil {
			return nil, err
		}
		if _, err := service.assetLogRepo.Create(&assetLog, tx); err != nil {
			return nil, err
		}
	}

	// Chuyển người dùng
	if userIdAssign != nil {
		assetLog := entity.AssetLog{
			Timestamp: time.Now(),
			Action:    "Transfer",
			AssetId:   asset.Id,
			ByUserId:  &byUser.Id,
			CompanyId: assignUser.CompanyId,
		}
		assetLog.AssignUserId = &assignUser.Id
		assetLog.ChangeSummary += fmt.Sprintf("Transfer from user: %v to user: %v\n",
			byUser.Email, assignUser.Email)
		if _, err := service.assetRepo.UpdateAssetOwner(assignment.AssetId, *userIdAssign, tx); err != nil {
			return nil, err
		}
		if err := service.assetRepo.UpdateOwner(assignment.AssetId, assignUser.Id, tx); err != nil {
			return nil, err
		}
		if *assignUser.DepartmentId != asset.DepartmentId {
			_, err := service.assetRepo.UpdateAssetDepartment(asset.Id, *assignUser.DepartmentId, tx)
			if err != nil {
				return nil, err
			}
		}
		if _, err := service.assetLogRepo.Create(&assetLog, tx); err != nil {
			return nil, err
		}
	}

	if _, err := service.assetRepo.UpdateAssetLifeCycleStage(assignment.AssetId, "In Use", tx); err != nil {
		return nil, err
	}
	err = service.assetRepo.UpdateAcquisitionDate(assignment.AssetId, time.Now(), tx)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit().Error; err != nil {
		return nil, err
	}
	var userManagerAsset *entity.Users
	if departmentId != nil {

		userManagerAsset, _ = service.userRepo.GetUserAssetManageOfDepartment(*departmentId)
	} else {
		userManagerAsset, _ = service.userRepo.GetUserAssetManageOfDepartment(asset.DepartmentId)
	}
	usersToNotifications := []*entity.Users{asset.OnwerUser, userManagerAsset}
	message := fmt.Sprintf("The asset '%v' (ID: %v) has just been updated by %v", asset.AssetName, asset.Id, byUser.Email)
	userNotificationUnique := utils.ConvertUsersToNotificationsToMap(userId, usersToNotifications)
	go func() {
		defer func() {
			if r := recover(); r != nil {
				fmt.Println("SendNotificationToUsers panic:", r)
			}
		}()
		service.NotificationService.SendNotificationToUsers(userNotificationUnique, message, *asset)
	}()
	return assignmentUpdated, nil
}

func (service *AssignmentService) Filter(userId int64, emailAssigned *string, emailAssign *string, assetName *string) ([]dto.AssignmentResponse, error) {
	var filter = filter.AssignmentFilter{
		EmailAssigned: emailAssigned,
		EmailAssign:   emailAssign,
		AssetName:     assetName,
	}
	users, err := service.userRepo.FindByUserId(userId)
	if err != nil {
		return nil, err
	}
	filter.CompanyId = users.CompanyId
	db := service.Repo.GetDB()
	dbFilter := filter.ApplyFilter(db.Model(&entity.Assignments{}), userId)
	var assignments []entity.Assignments
	switch users.Role.Slug {
	case "admin":
		assignments, err = service.Repo.GetAssignmentWithFilterForAdmin(dbFilter)
	case "assetManager":
		assignments, err = service.Repo.GetAssignmentWithFilterForManager(*users.DepartmentId, dbFilter)
	case "employee":
		assignments, err = service.Repo.GetAssignmentWithFilterForEmployee(userId, dbFilter)
	default:
		return nil, fmt.Errorf("Unauthorized role to perform assignment filtering.")
	}
	if err != nil {
		return nil, err
	}
	assignmentsRes := utils.ConvertAssignmentsToResponses(assignments)
	return assignmentsRes, nil
}

func (service *AssignmentService) GetAssignmentById(userId int64, id int64) (*dto.AssignmentResponse, error) {
	assignment, err := service.Repo.GetAssignmentById(id)
	if err != nil {
		return nil, err
	}
	assignResponse := utils.ConvertAssignmentToResponse(assignment)
	return &assignResponse, nil
}
