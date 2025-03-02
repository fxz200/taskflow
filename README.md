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
    ├──/docs(swagger)
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

</br>

<div style="background-color: #f07575; padding: 10px; border-radius: 5px;color: black;">
    <strong ;">⚠️</strong> 請先修改 docker-compose.yaml 中的 db volumes
</div> </br>

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
