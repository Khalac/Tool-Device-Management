package database

import (
	"BE_Manage_device/internal/domain/entity"
	"BE_Manage_device/internal/domain/repository"

	"gorm.io/gorm"
)

type PostgreSQLAssetsLogrepository struct {
	db *gorm.DB
}

func NewPostgreSQLAssetsLogRepository(db *gorm.DB) repository.AssetsLogRepository {
	return &PostgreSQLAssetsLogrepository{db: db}
}

func (r *PostgreSQLAssetsLogrepository) Create(assetsLog *entity.AssetLog, tx *gorm.DB) (*entity.AssetLog, error) {
	result := tx.Create(assetsLog)
	return assetsLog, result.Error
}

func (r *PostgreSQLAssetsLogrepository) GetLogByAssetId(assetId int64) ([]*entity.AssetLog, error) {
	assetLogs := []*entity.AssetLog{}
	result := r.db.Model(entity.AssetLog{}).Where("asset_id = ?", assetId).Find(&assetLogs)
	if result.Error != nil {
		return nil, result.Error
	}
	return assetLogs, nil
}

func (r *PostgreSQLAssetsLogrepository) GetDB() *gorm.DB {
	return r.db
}
