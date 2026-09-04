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

  const clientRows = [];
  const yclidRows = [];

  rows.forEach(function (row) {
    const dateTime = toUnixSeconds(row.dateTime);
    if (row.clientId) {
      clientRows.push({
        ClientId: row.clientId,
        Target: row.target,
        DateTime: dateTime,
      });
      return;
    }
    if (row.yclid) {
      yclidRows.push({
        Yclid: row.yclid,
        Target: row.target,
        DateTime: dateTime,
      });
    }
  });

  const batches = [];

  if (clientRows.length) {
    const csv = buildCsv(['ClientId', 'Target', 'DateTime'], clientRows);
    const result = await uploadCsvFile(csv, 'client');
    batches.push({ type: 'ClientId', count: clientRows.length, result });
  }

  if (yclidRows.length) {
    const csv = buildCsv(['Yclid', 'Target', 'DateTime'], yclidRows);
    const result = await uploadCsvFile(csv, 'yclid');
    batches.push({ type: 'Yclid', count: yclidRows.length, result });
  }

  return {
    uploaded: clientRows.length + yclidRows.length,
    batches,
  };
}

module.exports = {
  uploadConversions,
};
