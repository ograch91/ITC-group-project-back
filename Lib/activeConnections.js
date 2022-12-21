const list = new Set();

// export a function to return the module scoped variable (accessed by any module that imports this module)
module.exports = { getList: () => list };
