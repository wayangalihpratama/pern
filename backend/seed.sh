#!/usr/bin/env bash

npx sequelize-cli db:seed:undo:all
npx sequelize-cli db:seed:all