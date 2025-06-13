package entity

type Company struct {
	Id          int64  `gorm:"primaryKey;autoIncrement" json:"id"`
	CompanyName string `gorm:"unique" json:"companyName"`
	Email       string `gorm:"unique" json:"email"`
}
