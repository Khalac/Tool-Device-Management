package entity

import "time"

type Bill struct {
	Id                 int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	BillNumber         string    `gorm:"index" json:"billNumber"`
	Description        string    `json:"description"`
	CreateAt           time.Time `json:"createAt"`
	CreateById         int64     `json:"createById"`
	StatusBill         string    `json:"statusBill"`
	FileAttachmentBill *string   `json:"fileAttachmentBill"`
	ImageUploadBill    *string   `json:"imageUploadBill"`
	CompanyId          int64     `json:"-"`
	BuyerName          string    `json:"buyerName"`
	BuyerPhone         string    `json:"buyerPhone"`
	BuyerEmail         string    `json:"buyerEmail"`
	BuyerAddress       string    `json:"buyerAddress"`

	CreateBy   Users       `gorm:"foreignKey:CreateById;references:Id"`
	BillAssets []BillAsset `gorm:"foreignKey:BillId;references:Id"`
}
