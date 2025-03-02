# taskflow

```
/taskflow
 ├── /frontend
 ├── /backend
    ├──/controller
    ├──/model
    ├──/repository
    ├──/router
    ├──/sql
    ├──Dockerfile
    ├──main.go
 ├── /pgadmin
 ├── /pgdbdata
 ├── /sql
 ├── docker-compose.yml
 ├── README.md
```

### API

```
http://localhost:8080/swagger/index.html
```

### 開啟 container

```
docker-compose up -d
```

### 重啟特定 image

```
docker-compose stop backend
docker-compose build backend
docker-compose up -d backend
```
