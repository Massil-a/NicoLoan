/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',  // Utilise ts-jest pour les tests TypeScript
  testEnvironment: 'node',  // Utilise l'environnement Node (adapté pour backend)
  roots: ['<rootDir>/src', '<rootDir>/tests'],  // Indique à Jest où trouver les fichiers source et les tests
  transform: {
    '^.+\\.(ts|tsx)?$': ['ts-jest'],  // Transformation des fichiers TypeScript avec ts-jest
  },
  moduleDirectories: ['node_modules', 'src'],  // Permet d'importer des modules depuis le dossier 'src'
  testMatch: [
    '**/tests/**/*.test.ts',  // Cherche dans le dossier 'tests' tous les fichiers *.test.ts
    '**/?(*.)+(spec|test).ts',  // Cherche aussi dans des fichiers avec *spec* ou *test* dans le nom
  ],
};
