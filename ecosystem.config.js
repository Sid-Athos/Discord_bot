module.exports = {
  apps : [{
    name: 'Bot',
    script: './botDiscord.js',
    watch: true,
    cron_restart: '0 32 22 ? * *',
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }}]
};
