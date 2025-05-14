This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn dev
```
Notice that port is 5555 -> http://localhost:5555


## Deployment

# Web EC2 connect
- (DEV) ssh -i ploonet_lucasai_kr.pem ubuntu@ec2-13-125-251-28.ap-northeast-2.compute.amazonaws.com
- (PROD) ssh -i ploonet_lucasai_kr.pem ubuntu@ec2-54-180-94-227.ap-northeast-2.compute.amazonaws.com
- both, do login with su (Password : 0000)
```bash
su
```
- get in to the folder
```bash
cd mimecon-web
```
- update the git, build, run pm2 again
```bash
git pull && yarn build && pm2 restart 0
```