export const USER_ROLE_VALUES = ['admin', 'manager', 'user'];

export const FIELD_LIMITS = {
  id: {
    min: 1,
    max: 40,
    pattern: /^[A-Za-z0-9_-]+$/,
  },
  name: {
    min: 3,
    max: 100,
  },
  username: {
    min: 3,
    max: 30,
    pattern: /^[A-Za-z0-9._-]+$/,
  },
  password: {
    min: 4,
    max: 60,
  },
  productName: {
    min: 3,
    max: 120,
  },
  description: {
    min: 10,
    max: 500,
  },
  price: {
    min: 0.01,
    max: 999999.99,
    maxDecimals: 2,
  },
  stock: {
    min: 0,
    max: 999999,
  },
};

const isPlainObject = value =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const addError = (errors, field, message) => {
  errors.push({ field, message });
};

const finalizeValidation = (errors, data = null) => ({
  valid: errors.length === 0,
  errors,
  data: errors.length === 0 ? data : null,
});

const validateBodyObject = (body, errors) => {
  if (!isPlainObject(body)) {
    addError(errors, 'body', 'O corpo da requisicao deve ser um objeto JSON valido.');
    return false;
  }

  return true;
};

const validateAllowedFields = (body, allowedFields, errors) => {
  for (const field of Object.keys(body)) {
    if (!allowedFields.includes(field)) {
      addError(errors, field, `O campo "${field}" nao e permitido nesta operacao.`);
    }
  }
};

const validateStringField = (
  body,
  field,
  label,
  rules,
  errors,
  { required = false, trim = true, allowBlank = false } = {}
) => {
  const value = body[field];

  if (value === undefined) {
    if (required) {
      addError(errors, field, `${label} e obrigatorio.`);
    }

    return undefined;
  }

  if (typeof value !== 'string') {
    addError(errors, field, `${label} deve ser do tipo texto.`);
    return undefined;
  }

  const normalizedValue = trim ? value.trim() : value;

  if (!allowBlank && value.trim().length === 0) {
    addError(errors, field, `${label} nao pode estar vazio.`);
    return undefined;
  }

  if (rules.min !== undefined && normalizedValue.length < rules.min) {
    addError(
      errors,
      field,
      `${label} deve ter no minimo ${rules.min} caracteres.`
    );
  }

  if (rules.max !== undefined && normalizedValue.length > rules.max) {
    addError(
      errors,
      field,
      `${label} deve ter no maximo ${rules.max} caracteres.`
    );
  }

  if (rules.pattern && !rules.pattern.test(normalizedValue)) {
    addError(errors, field, rules.patternMessage || `${label} possui formato invalido.`);
  }

  return normalizedValue;
};

const validateEnumField = (
  body,
  field,
  label,
  allowedValues,
  errors,
  { required = false } = {}
) => {
  const value = body[field];

  if (value === undefined) {
    if (required) {
      addError(errors, field, `${label} e obrigatorio.`);
    }

    return undefined;
  }

  if (typeof value !== 'string') {
    addError(errors, field, `${label} deve ser do tipo texto.`);
    return undefined;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue.length === 0) {
    addError(errors, field, `${label} nao pode estar vazio.`);
    return undefined;
  }

  if (!allowedValues.includes(normalizedValue)) {
    addError(
      errors,
      field,
      `${label} deve ser um dos valores: ${allowedValues.join(', ')}.`
    );
  }

  return normalizedValue;
};

const validateBooleanField = (
  body,
  field,
  label,
  errors,
  { required = false } = {}
) => {
  const value = body[field];

  if (value === undefined) {
    if (required) {
      addError(errors, field, `${label} e obrigatorio.`);
    }

    return undefined;
  }

  if (typeof value !== 'boolean') {
    addError(errors, field, `${label} deve ser verdadeiro ou falso.`);
    return undefined;
  }

  return value;
};

const validateNumberField = (
  body,
  field,
  label,
  rules,
  errors,
  { required = false, integerOnly = false } = {}
) => {
  const value = body[field];

  if (value === undefined) {
    if (required) {
      addError(errors, field, `${label} e obrigatorio.`);
    }

    return undefined;
  }

  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    addError(errors, field, `${label} deve ser um numero valido.`);
    return undefined;
  }

  if (integerOnly && !Number.isInteger(value)) {
    addError(errors, field, `${label} deve ser um numero inteiro.`);
  }

  if (rules.min !== undefined && value < rules.min) {
    addError(errors, field, `${label} deve ser maior ou igual a ${rules.min}.`);
  }

  if (rules.max !== undefined && value > rules.max) {
    addError(errors, field, `${label} deve ser menor ou igual a ${rules.max}.`);
  }

  if (rules.maxDecimals !== undefined) {
    const decimalPart = value.toString().split('.')[1] || '';

    if (decimalPart.length > rules.maxDecimals) {
      addError(
        errors,
        field,
        `${label} deve ter no maximo ${rules.maxDecimals} casas decimais.`
      );
    }
  }

  return value;
};

const validatePartialUpdate = (body, allowedFields, entityLabel, errors) => {
  const providedAllowedFields = allowedFields.filter(field => field in body);

  if (providedAllowedFields.length === 0) {
    addError(
      errors,
      'body',
      `Informe ao menos um campo valido para atualizar ${entityLabel}.`
    );
  }
};

export const createValidationErrorResponse = errors => ({
  error: errors[0]?.message || 'Dados invalidos.',
  details: errors,
});

export const validateIdParam = (id, label = 'ID') => {
  const errors = [];

  if (typeof id !== 'string') {
    addError(errors, 'id', `${label} deve ser uma string.`);
    return finalizeValidation(errors);
  }

  const normalizedId = id.trim();

  if (normalizedId.length < FIELD_LIMITS.id.min || normalizedId.length > FIELD_LIMITS.id.max) {
    addError(
      errors,
      'id',
      `${label} deve ter entre ${FIELD_LIMITS.id.min} e ${FIELD_LIMITS.id.max} caracteres.`
    );
  }

  if (!FIELD_LIMITS.id.pattern.test(normalizedId)) {
    addError(errors, 'id', `${label} possui formato invalido.`);
  }

  return finalizeValidation(errors, normalizedId);
};

export const validateUsernameParam = username => {
  const errors = [];
  const normalizedUsername = validateStringField(
    { username },
    'username',
    'Username',
    {
      ...FIELD_LIMITS.username,
      patternMessage:
        'Username pode conter apenas letras, numeros, ponto, hifen e underscore.',
    },
    errors,
    { required: true }
  );

  return finalizeValidation(errors, normalizedUsername);
};

export const validateLoginPayload = body => {
  const errors = [];

  if (!validateBodyObject(body, errors)) {
    return finalizeValidation(errors);
  }

  validateAllowedFields(body, ['username', 'password'], errors);

  const username = validateStringField(
    body,
    'username',
    'Username',
    {
      ...FIELD_LIMITS.username,
      patternMessage:
        'Username pode conter apenas letras, numeros, ponto, hifen e underscore.',
    },
    errors,
    { required: true }
  );

  const password = validateStringField(
    body,
    'password',
    'Password',
    FIELD_LIMITS.password,
    errors,
    { required: true, trim: false }
  );

  return finalizeValidation(errors, { username, password });
};

export const validatePasswordChangePayload = body => {
  const errors = [];

  if (!validateBodyObject(body, errors)) {
    return finalizeValidation(errors);
  }

  validateAllowedFields(body, ['newPassword'], errors);

  const newPassword = validateStringField(
    body,
    'newPassword',
    'Nova senha',
    FIELD_LIMITS.password,
    errors,
    { required: true, trim: false }
  );

  return finalizeValidation(errors, { newPassword });
};

export const validateUserPayload = (body, mode = 'create') => {
  const errors = [];
  const allowedFields = ['name', 'username', 'password', 'role', 'active'];
  const isCreate = mode === 'create';

  if (!validateBodyObject(body, errors)) {
    return finalizeValidation(errors);
  }

  validateAllowedFields(body, allowedFields, errors);

  if (!isCreate) {
    validatePartialUpdate(body, allowedFields, 'o usuario', errors);
  }

  const name = validateStringField(body, 'name', 'Nome', FIELD_LIMITS.name, errors, {
    required: isCreate,
  });

  const username = validateStringField(
    body,
    'username',
    'Username',
    {
      ...FIELD_LIMITS.username,
      patternMessage:
        'Username pode conter apenas letras, numeros, ponto, hifen e underscore.',
    },
    errors,
    { required: isCreate }
  );

  const password = validateStringField(
    body,
    'password',
    'Password',
    FIELD_LIMITS.password,
    errors,
    { required: isCreate, trim: false }
  );

  const role = validateEnumField(body, 'role', 'Perfil', USER_ROLE_VALUES, errors, {
    required: isCreate,
  });

  const active = validateBooleanField(body, 'active', 'Status do usuario', errors, {
    required: isCreate,
  });

  const data = {};

  if (name !== undefined) data.name = name;
  if (username !== undefined) data.username = username;
  if (password !== undefined) data.password = password;
  if (role !== undefined) data.role = role;
  if (active !== undefined) data.active = active;

  return finalizeValidation(errors, data);
};

export const validateProductPayload = (body, mode = 'create') => {
  const errors = [];
  const allowedFields = ['name', 'description', 'price', 'stock', 'active'];
  const isCreate = mode === 'create';

  if (!validateBodyObject(body, errors)) {
    return finalizeValidation(errors);
  }

  validateAllowedFields(body, allowedFields, errors);

  if (!isCreate) {
    validatePartialUpdate(body, allowedFields, 'o produto', errors);
  }

  const name = validateStringField(
    body,
    'name',
    'Nome do produto',
    FIELD_LIMITS.productName,
    errors,
    { required: isCreate }
  );

  const description = validateStringField(
    body,
    'description',
    'Descricao do produto',
    FIELD_LIMITS.description,
    errors,
    { required: isCreate }
  );

  const price = validateNumberField(
    body,
    'price',
    'Preco do produto',
    FIELD_LIMITS.price,
    errors,
    { required: isCreate }
  );

  const stock = validateNumberField(
    body,
    'stock',
    'Estoque do produto',
    FIELD_LIMITS.stock,
    errors,
    { required: isCreate, integerOnly: true }
  );

  const active = validateBooleanField(body, 'active', 'Status do produto', errors, {
    required: isCreate,
  });

  const data = {};

  if (name !== undefined) data.name = name;
  if (description !== undefined) data.description = description;
  if (price !== undefined) data.price = price;
  if (stock !== undefined) data.stock = stock;
  if (active !== undefined) data.active = active;

  return finalizeValidation(errors, data);
};
