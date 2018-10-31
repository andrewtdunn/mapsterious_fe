var EasingAnimator = function (opt) {
  opt = opt || {}
  this.easingInterval = opt.easingInterval
  this.duration = opt.duration || 1000
  this.step = opt.step || 50
  this.easingFn = opt.easingFn || function easeInOutElastic (t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b
  }
  this.callBack = opt.callBack || function () {}
}
EasingAnimator.makeFromCallback = function (callBack) {
  return new EasingAnimator({
    callBack: callBack
  })
}
EasingAnimator.prototype.easeProp = function (obj, propDict) {
  propDict = propDict || {}
  var self = this
  var t = 0
  var outVals = JSON.parse(JSON.stringify(obj))

  clearInterval(self.easingInterval)
  self.easingInterval = setInterval(function () {
    t += self.step
    if (t >= self.duration) {
      clearInterval(self.easingInterval)
      self.callBack(propDict)
      return
    }
    var percent = self.easingFn(t, 0, 1, self.duration)
    Object.keys(propDict).forEach(function (key, i) {
      var oldVal = obj[key]

      outVals[key] = oldVal - percent * (oldVal - propDict[key])
    })
    self.callBack(outVals)
  }, self.step)
}

export default EasingAnimator
