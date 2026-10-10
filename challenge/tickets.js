export const QUESTIONS = {
  team: {
    type: 'choice',
    instructions: '¿A qué área va este ticket?',
    criteria: {
      facturacion: 'Cobros, facturas, reintegros y cargos en la tarjeta',
      envios: 'Entregas, demoras y paquetes dañados o perdidos',
      tecnica: 'Errores de la web o de la app',
      cuenta: 'Acceso, seguridad y datos de la cuenta',
    },
  },
  refund: {
    type: 'boolean',
    instructions: '¿El cliente pide que le devuelvan dinero?',
  },
  urgency: {
    type: 'score',
    instructions: '¿Qué tan urgente es el ticket?',
    criteria: [
      'baja: el cliente dice que puede esperar o solo consulta',
      'media: hay un problema, pero no bloquea una compra ni un acceso ahora',
      'alta: bloquea una compra o un acceso ahora, o hay riesgo de seguridad',
    ],
  },
  products: {
    type: 'choice',
    trap: true,
    instructions: '¿Cuántos productos distintos menciona el cliente?',
    criteria: { uno: null, dos: null, tres: null, cuatro: null, 'cinco o más': null },
  },
};

export const LEVELS = { urgency: ['baja', 'media', 'alta'] };

export const TICKETS = [
  { id: 'T01', text: 'Me cobraron dos veces la suscripción anual de octubre. Necesito que me devuelvan uno de los dos cargos.', expected: { team: 'facturacion', refund: true, urgency: 'media', products: 'uno' } },
  { id: 'T02', text: 'Pedí una cafetera y un molinillo el lunes y el seguimiento dice "en preparación" desde hace cuatro días. ¿Cuándo despachan?', expected: { team: 'envios', refund: false, urgency: 'media', products: 'dos' } },
  { id: 'T03', text: 'La app se cierra cada vez que intento pagar la bicicleta que tengo en el carrito. Es un regalo para hoy y no puedo terminar la compra.', expected: { team: 'tecnica', refund: false, urgency: 'alta', products: 'uno' } },
  { id: 'T04', text: 'No puedo entrar a mi cuenta: me dice que el correo no está registrado, pero ayer compré una notebook con esa misma cuenta y ahora no puedo ni ver el pedido.', expected: { team: 'cuenta', refund: false, urgency: 'alta', products: 'uno' } },
  { id: 'T05', text: '¿Me pueden mandar la factura A a nombre de la empresa por la silla y el escritorio que compramos la semana pasada? No hay apuro.', expected: { team: 'facturacion', refund: false, urgency: 'baja', products: 'dos' } },
  { id: 'T06', text: 'El televisor llegó con la pantalla partida. Quiero que me devuelvan la plata, no un reemplazo.', expected: { team: 'envios', refund: true, urgency: 'media', products: 'uno' } },
  { id: 'T07', text: 'Desde la última actualización no puedo ver las fotos de los productos que tengo guardados: ni del monitor, ni del teclado, ni de los parlantes.', expected: { team: 'tecnica', refund: false, urgency: 'media', products: 'tres' } },
  { id: 'T08', text: 'Quiero cambiar el correo de mi cuenta porque el viejo ya no lo uso. Tengo en curso un pedido de unas zapatillas y no quiero perder el seguimiento.', expected: { team: 'cuenta', refund: false, urgency: 'media', products: 'uno' } },
  { id: 'T09', text: 'Compré auriculares, una funda y un cargador, pero también me cobraron un mouse que nunca pedí. Quiero el reintegro del mouse.', expected: { team: 'facturacion', refund: true, urgency: 'media', products: 'cuatro' } },
  { id: 'T10', text: 'Compré una lámpara y una alfombra. La lámpara ya llegó y está perfecta; la alfombra figura para el viernes. ¿Es correcto? Solo quería confirmar.', expected: { team: 'envios', refund: false, urgency: 'baja', products: 'dos' } },
  { id: 'T11', text: 'Cuando busco "heladera" en la web, el filtro de precio no hace nada. No es urgente, pero es molesto.', expected: { team: 'tecnica', refund: false, urgency: 'baja', products: 'uno' } },
  { id: 'T12', text: 'Cancelé el pedido de la impresora dentro de las 24 horas y todavía no veo el reintegro en la tarjeta.', expected: { team: 'facturacion', refund: true, urgency: 'media', products: 'uno' } },
  { id: 'T13', text: 'Esperaba el sillón, la mesa ratona y dos sillas. Llegaron solo las sillas. Si el resto no llega esta semana, quiero cancelar y que me devuelvan todo.', expected: { team: 'envios', refund: true, urgency: 'media', products: 'tres' } },
  { id: 'T14', text: 'Alguien entró a mi cuenta y cambió la dirección de envío de mi pedido de una tablet y un lápiz óptico. Por favor bloquéenla ya.', expected: { team: 'cuenta', refund: false, urgency: 'alta', products: 'dos' } },
  { id: 'T15', text: 'La página de pago da error 500 cuando agrego la cafetera y la tostadora al carrito. Lo probé desde dos computadoras y pasa lo mismo.', expected: { team: 'tecnica', refund: false, urgency: 'alta', products: 'dos' } },
];

export const validate = (tickets = TICKETS, questions = QUESTIONS, levels = LEVELS) => {
  const errors = [];
  for (const ticket of tickets) {
    for (const [id, q] of Object.entries(questions)) {
      const want = ticket.expected?.[id];
      const valid =
        q.type === 'boolean' ? typeof want === 'boolean'
        : q.type === 'choice' ? Object.hasOwn(q.criteria, want ?? '')
        : (levels[id] ?? []).includes(want);
      if (!valid) errors.push(`${ticket.id}: invalid expected ${JSON.stringify(want)} for ${id}`);
    }
  }
  return errors;
};
