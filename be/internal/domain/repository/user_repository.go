package repository

import "BE_Manage_device/internal/domain/entity"

type UserRepository interface {
	Create(user *entity.Users) error
	FindByToken(token string) (*entity.Users, error)
	Update(user *entity.Users) error
	FindByEmail(email string) (*entity.Users, error)
}
