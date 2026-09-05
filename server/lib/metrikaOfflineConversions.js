const TIMEOUT_MS = Number(process.env.EXTERNAL_TIMEOUT_MS) || 30000;

function getCounterId() {
  const counterId = process.env.YANDEX_METRIKA_COUNTER_ID;
  if (!counterId) {
    throw new Error('YANDEX_METRIKA_COUNTER_ID не настроен');
  }
  return counterId;
}

function getOAuthToken() {
  const token = process.env.YANDEX_METRIKA_OAUTH_TOKEN;
  if (!token) {
    throw new Error('YANDEX_METRIKA_OAUTH_TOKEN не настроен');
  }
  return token;
}

function getCurrency() {
  return process.env.YANDEX_METRIKA_CURRENCY || 'RUB';
}

function toUnixSeconds(dateValue) {
  const timestamp = Math.floor(new Date(dateValue).getTime() / 1000);
  if (Number.isNaN(timestamp)) {
    throw new Error(`Невалидная дата конверсии: ${dateValue}`);
  }
  return timestamp;
}

function buildCsv(headers, rows) {
  const lines = [headers.join(',')];
  rows.forEach(function (row) {
    lines.push(headers.map(function (header) {
      return String(row[header]);
    }).join(','));
  });
  return lines.join('\n');
}

function buildRowsForType(rows, idField, idKey) {
  const currency = getCurrency();
  const hasPrice = rows.some(function (row) {
    return row.price !== undefined && row.price !== null && row.price !== '';
  });

  return rows.map(function (row) {
    const base = {
      [idField]: row[idKey],
      Target: row.target,
      DateTime: toUnixSeconds(row.dateTime),
    };

    if (hasPrice) {
      base.Price = row.price !== undefined && row.price !== null ? row.price : '';
      base.Currency = row.price ? currency : '';
    }

    return base;
  });
}

function getHeaders(idField, sampleRow) {
  const headers = [idField, 'Target', 'DateTime'];
  if (sampleRow && Object.prototype.hasOwnProperty.call(sampleRow, 'Price')) {
    headers.push('Price', 'Currency');
  }
  return headers;
}

async function uploadCsvFile(csvContent, idType) {
  const counterId = getCounterId();
  const token = getOAuthToken();
  const url = `https://api-metrika.yandex.net/management/v1/counter/${counterId}/offline_conversions/upload`;

  const formData = new FormData();
  formData.append('file', new Blob([csvContent], { type: 'text/csv' }), `${idType}-conversions.csv`);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `OAuth ${token}`,
      },
      body: formData,
      signal: controller.signal,
    });

    const data = await response.json().catch(function () {
      return {};
    });

    if (!response.ok) {
      const message = data.message || data.errors || response.statusText;
      throw new Error(`Metrika upload (${idType}): ${message}`);
    }

    return data;
  } finally {
    clearTimeout(timer);
  }
}

async function uploadConversions(rows) {
  if (!rows.length) {
    return { uploaded: 0, batches: [] };
  }

  const clientSourceRows = rows.filter(function (row) {
    return Boolean(row.clientId);
  });
  const yclidSourceRows = rows.filter(function (row) {
    return !row.clientId && row.yclid;
  });

  const batches = [];
  let uploaded = 0;

  if (clientSourceRows.length) {
    const clientRows = buildRowsForType(clientSourceRows, 'ClientId', 'clientId');
    const csv = buildCsv(getHeaders('ClientId', clientRows[0]), clientRows);
    const result = await uploadCsvFile(csv, 'client');
    batches.push({ type: 'ClientId', count: clientRows.length, result });
    uploaded += clientRows.length;
  }

  if (yclidSourceRows.length) {
    const yclidRows = buildRowsForType(yclidSourceRows, 'Yclid', 'yclid');
    const csv = buildCsv(getHeaders('Yclid', yclidRows[0]), yclidRows);
    const result = await uploadCsvFile(csv, 'yclid');
    batches.push({ type: 'Yclid', count: yclidRows.length, result });
    uploaded += yclidRows.length;
  }

  return {
    uploaded,
    batches,
  };
}

module.exports = {
  uploadConversions,
};
