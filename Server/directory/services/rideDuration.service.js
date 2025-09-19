function calcEstimatedRideDurationHours(fromPincode, toPincode) {
  const a = parseInt(fromPincode, 10);
  const b = parseInt(toPincode, 10);
  if (Number.isNaN(a) || Number.isNaN(b)) {
    throw new Error('Invalid pincode(s)');
  }
  return Math.abs(a - b) % 24;
}

module.exports = { calcEstimatedRideDurationHours };
