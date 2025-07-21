package filter

import (
	"fmt"
	"strconv"

	"gorm.io/gorm"
)

type BillFilter struct {
	BillNumber *string `form:"billNumber"`
	Status     *string `form:"statusBill"`
	CategoryId *string `form:"categoryId"`
	CompanyId  int64
}

func (f *BillFilter) ApplyFilter(db *gorm.DB) *gorm.DB {
	db.Where("bills.company_id = ?", f.CompanyId)
	if f.Status != nil {
		db = db.Where("status_bill = ?", *f.Status)
	}
	if f.CategoryId != nil {
		db = db.Joins("join bill_assets on bill_assets.bill_id = bills.id")
		db = db.Joins("join assets on assets.id = bill_assets.asset_id")
		db = db.Joins("join categories on categories.id = assets.category_id")
		parsedID, _ := strconv.ParseInt(*f.CategoryId, 10, 64)
		db = db.Where("categories.id = ?", parsedID)
	}
	if f.BillNumber != nil {
		str := "%" + fmt.Sprintf("%v", *f.BillNumber)
		str += "%"
		db = db.Where("LOWER(bills.bill_number) LIKE LOWER(?)", str)
	}
	return db.Select("DISTINCT ON (bills.id) bills.*").Preload("CreateBy").Preload("BillAssets.Asset").Preload("CreateBy.Role").Preload("BillAssets.Asset.Category").Preload("BillAssets.Asset.Department").Preload("BillAssets.Asset.Department.Location").Preload("BillAssets.Asset.OnwerUser").Order("bills.id, bill_number ASC")
}
