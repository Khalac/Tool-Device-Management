package dto

type CreateCategoryRequest struct {
	CategoryName string `json:"category_name" binding:"required"`
}
