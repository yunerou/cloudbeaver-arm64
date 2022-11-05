docker image for arm64
- Ref: https://github.com/dbeaver/cloudbeaver/wiki/Build-and-deploy

### Build
```sh
docker build --tag=yunerou/cloudbeaver:<version>-arm .
docker push yunerou/cloudbeaver:<version>-arm
```
