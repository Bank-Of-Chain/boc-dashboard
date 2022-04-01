export const calVaultAPY = (vaultDailyData) => {
  console.log(vaultDailyData)
  // console.log('vaultDailyData',JSON.stringify(vaultDailyData));
  let beginPricePerShare = 1;
  let beginTime = 0;
  for (let i = 0; i < vaultDailyData.length; i++) {
    if (vaultDailyData[i].totalShares) {
      beginPricePerShare = Number(vaultDailyData[i].unlockedPricePerShare);
      beginTime = Number(vaultDailyData[i].id);
      break;
    }
  }
  let endPricePerShare = 1;
  let endTime = 0;
  for (let i = vaultDailyData.length - 1; i > 0; i--) {
    if (vaultDailyData[i].unlockedPricePerShare) {
      endPricePerShare = Number(vaultDailyData[i].unlockedPricePerShare);
      endTime = Number(vaultDailyData[i].id);
      break;
    }
  }
  // console.log('beginTime,endTime',beginTime,endTime);
  return calAPY(beginPricePerShare, endPricePerShare, endTime - beginTime);
}

const calAPY = (beginPricePerShare, endPricePerShare, timeDiffSeconds) => {
  return Math.pow(1 + Number(endPricePerShare - beginPricePerShare) / Number(beginPricePerShare), 365 * 24 * 60 * 60 / timeDiffSeconds) - 1;
}

export const calVaultDailyAPY = (vaultDailyData) => {
  let lastPricePerShare = undefined;
  let lastTime = undefined;
  for (let i = 0; i < vaultDailyData.length; i++) {
    if (vaultDailyData[i].totalShares) {
      const currentPricePerShare = Number(vaultDailyData[i].tvl / vaultDailyData[i].totalShares);
      const currentBeginTime = Number(vaultDailyData[i].id);
      if (lastPricePerShare) {
        vaultDailyData[i].apy = calAPY(lastPricePerShare, currentPricePerShare, currentBeginTime - lastTime);
      }
      if(vaultDailyData[i].apy > 10){
        console.warn('apy more than 1000%',JSON.stringify(vaultDailyData[i]));
        vaultDailyData[i].apy =null;
      }
      lastPricePerShare = currentPricePerShare;
      lastTime = currentBeginTime;
    }
  }
  return vaultDailyData;
}

export const calVaultApyByRange = (vaultDailyData, preDayNumber) => {
  // console.log('vaultDailyData',JSON.stringify(vaultDailyData));
  const lastApyPoints = [];
  for (let i = 0; i < vaultDailyData.length; i++) {
    if (vaultDailyData[i].totalShares) {
      const currentPricePerShare = Number(vaultDailyData[i].tvl / vaultDailyData[i].totalShares);
      const currentBeginTime = Number(vaultDailyData[i].id);
      for (let j = 0; j < lastApyPoints.length; j++) {
        let lastApyPoint = lastApyPoints[j];
        if (currentBeginTime - preDayNumber * 24 * 3600 > lastApyPoint.lastTime) {
          lastApyPoints.shift();
          j--;
        } else {
          // console.log('lastTime, currentTime',lastApyPoint.lastTime,currentBeginTime, (currentBeginTime - lastApyPoint.lastTime)/3600/24);
          vaultDailyData[i].apy = calAPY(lastApyPoint.lastPricePerShare, currentPricePerShare, currentBeginTime - lastApyPoint.lastTime);
          if (vaultDailyData[i].apy > 10) {
            console.warn('apy more than 1000%', JSON.stringify(vaultDailyData[i]));
            vaultDailyData[i].apy = null;
          }
          break;
        }
      }
      lastApyPoints.push({
        lastPricePerShare: currentPricePerShare,
        lastTime: currentBeginTime
      });
    }
  }
  return vaultDailyData;
}
