module.exports = {
  root: true,
  parser: '@typescript-eslint/parser', // TypeScript를 위한 파서
  parserOptions: {
    project: './tsconfig.json',         // TypeScript 설정 파일 경로
    ecmaVersion: 2020,                  // 최신 ECMAScript 기능 사용
    sourceType: 'module',               // ECMAScript 모듈을 사용
  },
  env: {
    node: true,                         // Node.js 환경 변수 활성화
    jest: true,                         // Jest 테스트 환경 활성화
  },
  extends: [
    'airbnb-base',                      // Airbnb 베이스 스타일 가이드 (React 관련 규칙 제거)
    'airbnb-typescript/base',           // Airbnb의 TypeScript 지원
    'plugin:@typescript-eslint/recommended',  // TypeScript ESLint 플러그인 권장 설정
    'plugin:prettier/recommended',      // Prettier 통합
  ],
  plugins: ['@typescript-eslint', 'prettier'], // 사용 플러그인 (TypeScript와 Prettier)
  rules: {
    'prettier/prettier': 'error',       // Prettier 규칙 위반 시 에러로 처리
    'no-console': 'warn',               // console 사용 시 경고
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // 사용되지 않는 변수 경고, _로 시작하는 변수는 제외
    'import/prefer-default-export': 'off', // 기본 내보내기 강제하지 않음
    'class-methods-use-this': 'off',    // 클래스 메서드에서 this 사용하지 않아도 경고하지 않음
  },
  ignorePatterns: ['dist', 'node_modules'], // 빌드 결과물 및 의존성은 린트 제외
};
