const display = document.getElementById('display');

function adicionarNumero(numero) {
    display.value += numero;
}

function adicionarOperador(operador) {
    if (display.value === '') return;
    const ultimoChar = display.value[display.value.length - 1];
    if (['+', '-', '*', '/', '^'].includes(ultimoChar)) return;
    display.value += operador;
}

function limpar() {
    display.value = '';
}

function apagar() {
    display.value = display.value.slice(0, -1);
}

function adicionarFuncao(funcao) {
    const valor = parseFloat(display.value);
    if (isNaN(valor)) return;

    let resultado;
    switch (funcao) {
        case 'sqrt':
            resultado = Math.sqrt(valor);
            break;
        case 'sin':
            resultado = Math.sin(valor * (Math.PI / 180));
            break;
        case 'cos':
            resultado = Math.cos(valor * (Math.PI / 180));
            break;
        case 'tan':
            resultado = Math.tan(valor * (Math.PI / 180));
            break;
        case 'log':
            resultado = Math.log10(valor);
            break;
        default:
            return;
    }
    display.value = resultado;
}

function calcular() {
    const expressao = display.value;
    const tokens = expressao.match(/(\d+\.?\d*|\.\d+|[+\-*/^()])/g);

    if (!tokens) return;

    const resultado = calcularExpressao(tokens);
    display.value = resultado;
}

function calcularExpressao(tokens) {
    const pilhaNumeros = [];
    const pilhaOperadores = [];

    const precedencia = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        '^': 3,
    };

    function aplicarOperacao() {
        const operador = pilhaOperadores.pop();
        const b = pilhaNumeros.pop();
        const a = pilhaNumeros.pop();
        let resultado;

        switch (operador) {
            case '+':
                resultado = a + b;
                break;
            case '-':
                resultado = a - b;
                break;
            case '*':
                resultado = a * b;
                break;
            case '/':
                resultado = a / b;
                break;
            case '^':
                resultado = Math.pow(a, b);
                break;
        }
        pilhaNumeros.push(resultado);
    }

    tokens.forEach((token) => {
        if (!isNaN(token)) {
            pilhaNumeros.push(parseFloat(token));
        } else if (token in precedencia) {
            while (
                pilhaOperadores.length &&
                precedencia[token] <= precedencia[pilhaOperadores[pilhaOperadores.length - 1]]
            ) {
                aplicarOperacao();
            }
            pilhaOperadores.push(token);
        }
    });

    while (pilhaOperadores.length) {
        aplicarOperacao();
    }

    return pilhaNumeros[0];
}
