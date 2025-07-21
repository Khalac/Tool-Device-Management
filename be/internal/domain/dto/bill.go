package dto

import (
	"time"
)

type BillCreateRequest struct {
	AssetId     int64  `json:"assetId"`
	Description string `json:"description"`
	Status      bool   `json:"status"`
}

type BillResponse struct {
	BillNumber         string          `json:"billNumber"`
	Description        string          `json:"description"`
	CreateAt           time.Time       `json:"createAt"`
	Asset              []AssetResponse `json:"assets"`
	CreateBy           UserResponse    `json:"createBy"`
	StatusBill         string          `json:"statusBill"`
	FileAttachmentBill string          `json:"fileAttachmentBill"`
	ImageUploadBill    string          `json:"imageUploadBill"`
	Buyer              BuyerResponse   `json:"buyer"`
}

type BuyerResponse struct {
	BuyerName    string `json:"buyerName"`
	BuyerPhone   string `json:"buyerPhone"`
	BuyerEmail   string `json:"buyerEmail"`
	BuyerAddress string `json:"buyerAddress"`
}
