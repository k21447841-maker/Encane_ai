module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
          browsers: ['>0.2%', 'not dead', 'not op_mini all']
        },
        modules: 'auto',
        useBuiltIns: 'usage',
        corejs: 3
      }
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
        development: process.env.NODE_ENV === 'development'
      }
    ]
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    process.env.NODE_ENV === 'development' && 'react-refresh/babel'
  ].filter(Boolean),
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current'
            }
          }
        ]
      ],
      plugins: ['@babel/plugin-transform-modules-commonjs']
    },
    production: {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            loose: true
          }
        ]
      ],
      plugins: [
        '@babel/plugin-transform-react-constant-elements',
        '@babel/plugin-transform-react-inline-elements'
      ]
    }
  }
}