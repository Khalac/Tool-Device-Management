package filter

import (
	"BE_Manage_device/pkg/utils"
	"fmt"
	"strings"

	"gorm.io/gorm"
)

type AssetFilter struct {
	AssetName    *string `form:"assetName" json:"assetName"`
	Status       *string `form:"status" json:"status"`
	CategoryId   *string `form:"categoryId" json:"categoryId"`
	Cost         *string `form:"cost" json:"cost"`
	SerialNumber *string `form:"serialNumber" json:"serialNumber"`
	Email        *string `form:"email" json:"email"`
	DepartmentId *string `form:"departmentId" json:"departmentId"`
	CompanyId    int64
}

type AssetFilterDashboard struct {
	CategoryId   *string `form:"categoryId" json:"categoryId"`
	DepartmentId *string `form:"departmentId" json:"departmentId"`
	Status       *string `form:"status" json:"status"`
	Export       *string `form:"export" json:"export"` // "csv" hoặc "pdf" hoặc ""
}

func (f *AssetFilter) ApplyFilter(db *gorm.DB, userId int64) *gorm.DB {
	db.Where("assets.company_id  = ?", f.CompanyId)
	db = db.Joins("JOIN user_rbacs on user_rbacs.asset_id = assets.id").
		Joins("JOIN roles on roles.id = user_rbacs.role_id").
		Joins("JOIN role_permissions on role_permissions.role_id = roles.id").
		Joins("JOIN permissions on permissions.id = role_permissions.permission_id").
		Joins("JOIN users on users.id = assets.owner").
		Where("user_rbacs.user_id = ? and permissions.slug = ?", userId, "view-assets")
	if f.Status != nil {
		db = db.Where("status = ?", *f.Status)
	}
	if f.AssetName != nil {
		str := "%" + fmt.Sprintf("%v", *f.AssetName)
		str += "%"
		db = db.Where("LOWER(assets.asset_name) LIKE LOWER(?)", str)
	}
	if f.CategoryId != nil {
		db = db.Joins("join categories on categories.id = assets.category_id")
		parsedID, _ := utils.ParseInt64Ptr(f.CategoryId)
		db = db.Where("categories.id = ?", parsedID)
	}
	if f.Cost != nil {
		order := strings.ToUpper(strings.TrimSpace(*f.Cost))
		switch order {
		case "DESC":
			db = db.Order("assets.cost DESC")
		case "ASC":
			db = db.Order("assets.cost ASC")
		default:
			db = db.Order("assets.id ASC")
		}
	}
	if f.SerialNumber != nil {
		str := fmt.Sprintf("%v", *f.SerialNumber)
		str += "%"
		db = db.Where("LOWER(assets.serial_number) LIKE LOWER(?)", str)
	}
	if f.Email != nil {
		str := fmt.Sprintf("%v", *f.Email)
		str += "%"
		db = db.Where("LOWER(users.email) LIKE LOWER(?)", str)
	}
	if f.DepartmentId != nil {
		parsedID, _ := utils.ParseInt64Ptr(f.DepartmentId)
		db = db.Where("assets.department_id = ?", parsedID)
	}
	return db.Preload("Category").Preload("Department").Preload("OnwerUser").Preload("Department.Location")
}

func (f *AssetFilterDashboard) ApplyFilterDashBoard(db *gorm.DB, userId int64) *gorm.DB {
	if f.CategoryId != nil {
		parsedID, _ := utils.ParseInt64Ptr(f.CategoryId)
		db = db.Where("categories.id = ?", parsedID)
	}
	if f.DepartmentId != nil {
		parsedID, _ := utils.ParseInt64Ptr(f.DepartmentId)
		db = db.Where("assets.department_id = ?", parsedID)
	}
	if f.Status != nil {
		db = db.Where("status = ?", *f.Status)
	}
	return db.Preload("Category").Preload("Department").Preload("OnwerUser").Preload("Department.Location")
}
