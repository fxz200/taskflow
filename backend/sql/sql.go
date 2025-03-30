package sql

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"

	"gopkg.in/yaml.v2"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Connect *gorm.DB

type conf struct {
	Host     string `yaml:"host"`
	UserName string `yaml:"username"`
	Password string `yaml:"password"`
	DbName   string `yaml:"dbname"`
	Port     string `yaml:"port"`
}

func (c *conf) getConf(env string) *conf {
	yamlFile, err := ioutil.ReadFile("sql/connect.yaml")
	if err != nil {
		log.Fatalf("Failed to read config file: %v", err)
	}

	configs := make(map[string]conf)
	err = yaml.Unmarshal(yamlFile, &configs)
	if err != nil {
		log.Fatalf("Failed to unmarshal YAML: %v", err)
	}

	if config, ok := configs[env]; ok {
		*c = config
	} else {
		log.Fatalf("Environment '%s' not found in config", env)
	}
	return c
}

func InitPostgres() (err error) {
	var c conf
	env := "default"
	if e := os.Getenv("ENV"); e != "" {
		env = e
	}
	log.Printf("Current ENV: %s", env)
	conf := c.getConf(env)
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai",
		conf.Host,
		conf.UserName,
		conf.Password,
		conf.DbName,
		conf.Port,
	)
	Connect, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Printf("Failed to connect to database: %v", err)
		return err
	}
	log.Printf("DB ready for environment: %s", env)
	return nil
}
