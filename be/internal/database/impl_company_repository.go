package database

import (
	"BE_Manage_device/internal/domain/entity"
	"BE_Manage_device/internal/domain/repository"

	"gorm.io/gorm"
)

type PostgreSQLCompanyRepository struct {
	db *gorm.DB
}

func NewPostgreSQLCompanyRepository(db *gorm.DB) repository.CompanyRepository {
	return &PostgreSQLCompanyRepository{db: db}
}

func (r *PostgreSQLCompanyRepository) GetCompanyByEmail(email string) (*entity.Company, error) {
	company := entity.Company{}
	result := r.db.Model(entity.Company{}).Where("email = ?", email).Find(&company)
	if result.Error != nil {
		return nil, result.Error
	}
	return &company, nil
}
