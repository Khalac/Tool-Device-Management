package repository

import (
	"BE_Manage_device/internal/domain/entity"

	"gorm.io/gorm"
)

type AssignmentRepository interface {
	Create(assignment *entity.Assignments, tx *gorm.DB) (*entity.Assignments, error)
	Update(assignmentId int64, AssignBy, assetId int64, userId, departmentId *int64, tx *gorm.DB) (*entity.Assignments, error)
	GetDB() *gorm.DB
	GetAssignmentById(id int64) (*entity.Assignments, error)
	GetAssignmentByAssetId(assetId int64) (*entity.Assignments, error)
	GetAssignmentForEmployee(userId int64) (*entity.Assignments, error)
	GetAssignmentWithFilterForAdmin(dbFilter *gorm.DB) ([]entity.Assignments, error)
	GetAssignmentWithFilterForManager(departmentId int64, dbFilter *gorm.DB) ([]entity.Assignments, error)
	GetAssignmentWithFilterForEmployee(userId int64, dbFilter *gorm.DB) ([]entity.Assignments, error)
}
