// Elementos do DOM
const navigateBtn = document.getElementById('navigateBtn')
const backBtn = document.getElementById('backBtn')
const commandsInput = document.getElementById('commands')
const resultDiv = document.getElementById('result')
const calculationDiv = document.getElementById('calculation')

// Estado da jornada
let journeyHistory = []

/**
 * Função principal para navegar o elfo na floresta encantada
 * @param {string[]} steps - Array de comandos ("UP", "DOWN", "LEFT", "RIGHT")
 * @returns {Object} Objeto com posição final no formato { x: number, y: number }
 */
function navigateElf(steps) {
  // Posição inicial (0, 0) - canto superior esquerdo
  let position = { x: 0, y: 0 }

  // Processa cada comando
  steps.forEach(step => {
    const cleanStep = step.trim().toUpperCase()

    // Verifica o comando e atualiza a posição
    switch (cleanStep) {
      case 'UP':
        // Move para cima (diminui y), mas não pode ir abaixo de 0
        if (position.y > 0) {
          position.y--
        }
        break
      case 'DOWN':
        // Move para baixo (aumenta y), mas não pode passar de 9
        if (position.y < 9) {
          position.y++
        }
        break
      case 'LEFT':
        // Move para esquerda (diminui x), mas não pode ir abaixo de 0
        if (position.x > 0) {
          position.x--
        }
        break
      case 'RIGHT':
        // Move para direita (aumenta x), mas não pode passar de 9
        if (position.x < 9) {
          position.x++
        }
        break
      default:
        // Comando inválido - não faz nada
        break
    }
  })

  // Retorna apenas a posição final no formato solicitado
  return { x: position.x, y: position.y }
}

/**
 * Função para navegar com cálculos detalhados (para a interface)
 * @param {string[]} steps - Array de comandos ("UP", "DOWN", "LEFT", "RIGHT")
 * @returns {Object} Objeto com posição final e cálculo detalhado
 */
function navigateElfWithCalculation(steps) {
  // Posição inicial (0, 0) - canto superior esquerdo
  let position = { x: 0, y: 0 }
  let calculationSteps = ['🌲 Eldrin começa sua jornada na posição (0, 0)']
  let warningTriggered = false

  // Processa cada comando
  steps.forEach((step, index) => {
    const previousPosition = { ...position }
    const cleanStep = step.trim().toUpperCase()
    let movementValid = true

    // Verifica o comando e atualiza a posição
    switch (cleanStep) {
      case 'UP':
        if (position.y > 0) {
          position.y--
        } else {
          movementValid = false
        }
        break
      case 'DOWN':
        if (position.y < 9) {
          position.y++
        } else {
          movementValid = false
        }
        break
      case 'LEFT':
        if (position.x > 0) {
          position.x--
        } else {
          movementValid = false
        }
        break
      case 'RIGHT':
        if (position.x < 9) {
          position.x++
        } else {
          movementValid = false
        }
        break
      default:
        // Comando inválido
        calculationSteps.push(
          `❌ Passo ${index + 1}: Comando "${step}" inválido - Eldrin permanece em (${position.x}, ${position.y})`
        )
        return
    }

    // Verifica se o movimento foi válido
    if (!movementValid) {
      warningTriggered = true
      calculationSteps.push(
        `⚠️ Passo ${
          index + 1
        }: Tentativa de mover ${cleanStep} - Eldrin quase caiu em um buraco temporal! Permanece em (${position.x}, ${
          position.y
        })`
      )
    } else {
      calculationSteps.push(
        `✨ Passo ${index + 1}: Movendo ${cleanStep} - De (${previousPosition.x}, ${previousPosition.y}) para (${
          position.x
        }, ${position.y})`
      )
    }
  })

  // Adiciona mensagem final
  if (warningTriggered) {
    calculationSteps.push('<br>⚠️ Cuidado! Eldrin encontrou perigos na floresta!')
  } else {
    calculationSteps.push('<br>🌳 Eldrin navegou com segurança pela floresta!')
  }

  // Retorna o resultado e os cálculos
  return {
    finalPosition: position,
    calculation: calculationSteps.join('<br>')
  }
}

/**
 * Valida e formata os comandos inseridos pelo usuário
 * @param {string} input - String de comandos separados por vírgula
 * @returns {string[]} Array de comandos validados
 */
function validateCommands(input) {
  return input
    .split(',')
    .map(cmd => cmd.trim())
    .filter(cmd => {
      const upperCmd = cmd.toUpperCase()
      return upperCmd === 'UP' || upperCmd === 'DOWN' || upperCmd === 'LEFT' || upperCmd === 'RIGHT'
    })
}

// Manipulador do botão NAVEGAR
navigateBtn.addEventListener('click', () => {
  const commandsText = commandsInput.value

  if (!commandsText.trim()) {
    resultDiv.textContent = 'Por favor, insira os comandos mágicos!'
    calculationDiv.innerHTML = ''
    return
  }

  // Valida e converte a entrada
  const commands = validateCommands(commandsText)

  if (commands.length === 0) {
    resultDiv.textContent = 'Nenhum comando válido encontrado! Use UP, DOWN, LEFT ou RIGHT separados por vírgulas.'
    calculationDiv.innerHTML = ''
    return
  }

  // Navega o elfo (usando a função com cálculos para interface)
  const { finalPosition, calculation } = navigateElfWithCalculation(commands)

  // Atualiza o histórico
  journeyHistory.push({
    commands: [...commands],
    position: { ...finalPosition },
    calculation: calculation
  })

  // Exibe os resultados
  resultDiv.innerHTML = `🧝‍♂️ Posição final de Eldrin: <span class="highlight">(${finalPosition.x}, ${finalPosition.y})</span>`
  calculationDiv.innerHTML = calculation
})

// Manipulador do botão VOLTAR
backBtn.addEventListener('click', () => {
  if (journeyHistory.length > 0) {
    // Remove a última jornada do histórico
    journeyHistory.pop()

    if (journeyHistory.length > 0) {
      // Recupera a jornada anterior
      const lastJourney = journeyHistory[journeyHistory.length - 1]
      commandsInput.value = lastJourney.commands.join(', ')
      resultDiv.innerHTML = `🧝‍♂️ Posição final de Eldrin: <span class="highlight">(${lastJourney.position.x}, ${lastJourney.position.y})</span>`
      calculationDiv.innerHTML = lastJourney.calculation
    } else {
      // Sem histórico - limpa tudo
      commandsInput.value = ''
      resultDiv.textContent = ''
      calculationDiv.innerHTML = ''
    }
  } else {
    resultDiv.textContent = 'Nenhuma jornada para voltar!'
  }
})

// Animação adicional para o tema de floresta
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.container')

  // Efeito de aparecimento suave
  container.style.opacity = '0'
  container.style.transform = 'translateY(20px)'
  container.style.transition = 'opacity 0.5s ease, transform 0.5s ease'

  setTimeout(() => {
    container.style.opacity = '1'
    container.style.transform = 'translateY(0)'
  }, 100)

  // Adiciona classe ativa ao menu
  const currentPage = window.location.pathname.split('/').pop() || 'index.html'
  const menuItems = document.querySelectorAll('.menu li')

  menuItems.forEach(item => {
    const link = item.querySelector('a')
    if (link && link.getAttribute('href') === currentPage) {
      item.classList.add('active')
    } else {
      item.classList.remove('active')
    }
  })
})

// Permite navegação por teclado
commandsInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    navigateBtn.click()
  }
})
