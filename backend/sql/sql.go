package sql

import (
	"fmt"
	"io/ioutil"
	"log"

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

func (c *conf) getConf() *conf {
    yamlFile, err := ioutil.ReadFile("sql/connect.yaml")
    if err != nil {
        fmt.Println(err.Error())
    }

    // string => conf
    err = yaml.Unmarshal(yamlFile, c)
    if err != nil {
        fmt.Println(err.Error())
    }
    return c
}

func InitPostgres() (err error) {
    var c conf

    conf := c.getConf()
    // fmt.Printf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai\n",
    //     conf.Host,
    //     conf.UserName,
    //     conf.Password,
    //     conf.DbName,
    //     conf.Port,
    // )
    dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai",
        conf.Host,
        conf.UserName,
        conf.Password,
        conf.DbName,
        conf.Port,
    )
    Connect, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        return err
    }
    log.Println("DB ready")
    return nil
}