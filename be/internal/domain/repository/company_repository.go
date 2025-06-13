package repository

import "BE_Manage_device/internal/domain/entity"

type CompanyRepository interface {
	GetCompanyByEmail(email string) (*entity.Company, error)
}
