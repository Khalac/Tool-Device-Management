package dto

type CreateDepartmentRequest struct {
	DepartmentName string `json:"department_name" binding:"required"`
	LocationId     int64  `json:"location_id" binding:"required"`
}
