const getPaginationResponse = (entities, botValue, topValue) => {
  const top = +topValue;
  const bot = +botValue || 0;
  const pageSize = top - bot;
  return {
    entities: entities.slice(bot, bot + top),
    pagination: {
      currentPage: bot / pageSize + 1,
      pageSize,
      pages: bot ? Math.round(entities.length / pageSize) + 1 : 1,
    },
  };
};

module.exports = getPaginationResponse;
