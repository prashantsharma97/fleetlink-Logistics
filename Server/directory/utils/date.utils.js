function intervalsOverlap(startA, endA, startB, endB) {
  return (startA < endB) && (startB < endA);
}

module.exports = { intervalsOverlap };
