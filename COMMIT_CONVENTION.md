# Padrões de Commit - VitaFlow

Este projeto utiliza o padrão [Conventional Commits](https://www.conventionalcommits.org/) para padronizar as mensagens de commit.

## Formato

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

## Tipos Permitidos

- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Mudanças na documentação
- **style**: Formatação, ponto e vírgula, etc (não afeta o código)
- **refactor**: Refatoração de código (não adiciona funcionalidade nem corrige bugs)
- **perf**: Melhoria de performance
- **test**: Adição ou correção de testes
- **chore**: Mudanças em build, dependências, ferramentas, etc
- **ci**: Mudanças em CI/CD
- **build**: Mudanças no sistema de build
- **revert**: Reverter commit anterior

## Exemplos

### ✅ Commits Válidos

```
feat: add user authentication
fix: resolve login validation issue
docs: update API documentation
style: fix code formatting
refactor: improve component structure
perf: optimize database queries
test: add unit tests for user service
chore: update dependencies
```

### ❌ Commits Inválidos

```
Add new feature
fix bug
Update code
WIP
test
```

## Regras

1. **Tipo obrigatório**: Sempre comece com um dos tipos permitidos
2. **Minúsculas**: Tipo e escopo devem estar em minúsculas
3. **Descrição obrigatória**: Sempre inclua uma descrição clara
4. **Sem ponto final**: Não termine a descrição com ponto
5. **Máximo 100 caracteres**: Limite o tamanho do cabeçalho
6. **Corpo opcional**: Use para explicações detalhadas quando necessário

## Configuração

O projeto está configurado com:

- **Husky**: Git hooks
- **Commitlint**: Validação de mensagens de commit
- **Lint-staged**: Linting antes do commit
- **Prettier**: Formatação automática de código

## Como Funciona

1. **Pre-commit**: Executa linting e formatação nos arquivos modificados
2. **Commit-msg**: Valida se a mensagem de commit segue o padrão
3. **Falha automática**: Commits que não seguem o padrão são rejeitados

## Bypass (Emergência)

Em casos extremos, você pode usar:

```bash
git commit --no-verify -m "mensagem"
```

⚠️ **Use com moderação e apenas em emergências!**
