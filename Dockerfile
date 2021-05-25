FROM btwiuse/k0s as k0s

FROM node:buster

ENV TZ utc

COPY --from=k0s /usr/bin/k0s /bin/k0s

RUN chmod +x /bin/k0s

RUN apt update && apt install -y curl bash git tmux

RUN npm i -g @subql/node@0.13 @subql/query @subql/cli

COPY . /app

RUN chmod +x /app/entrypoint.sh

WORKDIR /app

RUN yarn && yarn codegen && yarn build

ENTRYPOINT [ "/bin/bash", "-c" ]

CMD /app/entrypoint.sh
