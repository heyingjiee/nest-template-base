module.exports = {
  apps: [
    {
      name: 'nest-server', // name 唯一，不能有冲突
      script: './src/main.js',
      env_qa: {
        NODE_ENV: 'qa',
      },
      env_prod: {
        NODE_ENV: 'prod',
      },
    },
  ],
};
