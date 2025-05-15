package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var (
	Port              string
	AccessSecret      string
	RefreshSecret     string
	SmtpPasswd        string
	BASE_URL_FRONTEND string
	BASE_URL_BACKEND  string
	DB_DNS            string
)

func LoadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("failed to load env:", err)
	}
	Port = ":" + os.Getenv("PORT")
	AccessSecret = os.Getenv("AccessSecret")
	RefreshSecret = os.Getenv("refreshSecret")
	SmtpPasswd = os.Getenv("SMTP_PASSWORD")
	BASE_URL_FRONTEND = os.Getenv("BASE_URL_FRONTEND")
	BASE_URL_BACKEND = os.Getenv("BASE_URL_BACKEND")
	DB_DNS = os.Getenv("DB_DNS")
}
