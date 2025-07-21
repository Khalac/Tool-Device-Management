package entity

import "time"

type BillAsset struct {
	BillId     int64      `gorm:"primaryKey" json:"bill_id"`
	AssetId    int64      `gorm:"primaryKey" json:"asset_id"`
	Created_at time.Time  `gorm:"NOT NULL" json:"created_at"`
	Updated_at *time.Time `json:"updated_at"`

	Asset Assets `gorm:"foreignKey:AssetId;references:Id"`
}
