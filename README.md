# Projeto Plantao APP

## Frontend
Arquivos do frontend do projeto

### Usage


```bash
git clone https://github.com/mistermagson/plantao-app-frontend.git
```


```bash
cd plantao-app-frontend/frontend
```

### Instalar Dependencias


```bash
yarn install
```

### Rodar Localmente


```bash
yarn dev 
```

### Deploy


```bash
pm2 start yarn --name "frontend-plantao" -- run start 
```


## Backend
Arquivos do backend do projeto

### Usage


```bash
git clone https://github.com/mistermagson/plantao-app-backend.git
```


```bash
cd plantao-app-backend
```

### Instalar Dependencias


```bash
yarn install
```

### Rodar Localmente

```bash
yarn develop 
```

### Deploy

#### 1a vez


```bash
Clonar o repositorio 
```


```bash
pm2 start yarn --name "backend-plantao" -- run start ```

#### 2a vez em diante

```bash
 git fetch 
 ```

```bash
git pull 
```

```bash
yarn build 
```

```bash
pm2 restart frontend-plantao --update-env
```