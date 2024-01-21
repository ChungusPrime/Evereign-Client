export const apps = [

  {
    name: "Authentication Server",
    script: "./AuthenticationServer/server.js",
    instances: 1,
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production",
      PORT: 8081,
      DATABASE: "evereign_auth",
      SERVER: "AUTHENTICATION"
    },
  },

  {
    name: "Sentinel - Game Server",
    script: "./GameServer/server.js",
    instances: 1,
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production",
      PORT: 8082,
      DATABASE: "evereign_sentinel",
      SERVER: "SENTINEL"
    },
  },

  {
    name: "Crown - Game Server",
    script: "./GameServer/server.js",
    instances: 1,
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production",
      PORT: 8083,
      DATABASE: "evereign_crown",
      SERVER: "CROWN"
    },
  },

  {
    name: "Phantom - Game Server",
    script: "./GameServer/server.js",
    instances: 1,
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production",
      PORT: 8084,
      DATABASE: "evereign_phantom",
      SERVER: "PHANTOM"
    },
  },

  {
    name: "Reaver - Game Server",
    script: "./GameServer/server.js",
    instances: 1,
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production",
      PORT: 8085,
      DATABASE: "evereign_reaver",
      SERVER: "REAVER"
    },
  }

];
