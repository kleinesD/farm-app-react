import moment from "moment";

const useProjection = (animalsArr: any[], yearsAmount: number) => {
  let data;
  let calfAvg = 12;
  

  /* Counting an average between calvings based on lactations | ON HOLD | currently using only avearge data */

  /* data.cows.forEach(cow => {
    if (cow.lactations.length <= 1) return;

    let spanArr = [];
    cow.lactations.forEach((lact, inx, arr) => {
      if (inx === 0) return;

      spanArr.push((new Date(lact.startDate).getTime() - new Date(arr[inx - 1].startDate).getTime()) / 1000 / 60 / 60 / 24 / 30 / 12);
    });
  }); */

  /* Converting animals data into another format */
  let animals: any[] = [];
  animalsArr.forEach(animal => {
    animals.push({
      status: animal.status,
      gender: animal.gender,
      birthDate: animal.birthDate,
      lastLact: animal.lactations.length > 0 ? animal.lactations[animal.lactations.length - 1].startDate : undefined,
    });
  });


  /* Counting projected data for n amount of years */
  let years = [];
  years.push({ year: 0, animals: JSON.parse(JSON.stringify(animals)) })
  for (let i = 1; i <= yearsAmount; i++) {
    let date = moment().add(i, 'year').toDate();

    /* Removing animals cuz of illness. For average I took 1.67% death rate.*/
    animals.forEach((animal, inx, arr) => {
      if ((Math.random() * (100 - 0 + 1) + 0) < 1.67) {
        animal.status = 'diseased';
        animal.cause = 'illness';
        animal.dateOfDeath = date;
      };
    });

    /* Removing animals cuz of slaughtering. For average I took 24 months for a bull and 72 months for a cow.*/
    animals.forEach((animal, inx, arr) => {
      if (animal.status === 'diseased') return;
      let ageInMonths = (new Date(date).getTime() - new Date(animal.birthDate).getTime()) / 1000 / 60 / 60 / 24 / 30;

      if (animal.gender === 'male' && ageInMonths >= 24 || animal.gender === 'female' && ageInMonths >= 84) {
        animal.status = 'diseased';
        animal.cause = 'slaughtered';
        animal.dateOfDeath = date;
      };
    });

    /* Adding calvings with average calving interval of 13 months */
    animals.forEach(animal => {
      if (animal.gender === 'male' || animal.status === 'diseased') return;
      let ageInMonths = (new Date(date).getTime() - new Date(animal.birthDate).getTime()) / 1000 / 60 / 60 / 24 / 30;

      if (animal.lastLact && ((new Date(date).getTime() - new Date(animal.lastLact).getTime()) / 1000 / 60 / 60 / 24 / 30) >= 13 || ageInMonths >= 24) {
        animal.lastLact = date;
        let deathDecider = (Math.random() * (100 - 0 + 1) + 0) < 12;
        animals.push({
          status: deathDecider ? 'diseased' : 'alive',
          cause: deathDecider ? 'calving-death' : '',
          dateOfDeath: deathDecider ? date : '',
          gender: (Math.random() * (100 - 0 + 1) + 0) < 50 ? 'female' : 'male',
          birthDate: date,
          lastLact: undefined,
        });
      }
    });

    /* Creating a timeline of herd change */
    /* let animalsBuf = animals.map(animal => { return animal }); */
    let animalsBuf = JSON.parse(JSON.stringify(animals));


    years.push({ year: i, animals: animalsBuf });
  }
  /* years.forEach((year) => {
    console.log({
      year: year.year, 
      cows: year.animals.filter(animal => animal.status === 'alive' && animal.gender === 'female' && ((new Date(moment().add(year.year, 'year')).getTime() - new Date(animal.birthDate).getTime()) / 1000 / 60 / 60 / 24 / 30) >= 24),
      bulls: year.animals.filter(animal => animal.status === 'alive' && animal.gender === 'male' && ((new Date(moment().add(year.year, 'year')).getTime() - new Date(animal.birthDate).getTime()) / 1000 / 60 / 60 / 24 / 30) >= 12),
      calves: year.animals.filter(animal => animal.status === 'alive' && ((new Date(moment().add(year.year, 'year')).getTime() - new Date(animal.birthDate).getTime()) / 1000 / 60 / 60 / 24 / 30) < 12),
      cowsSlaughtered: year.animals.filter(animal => animal.status = 'diseased' && animal.cause === 'slaughtered' && animal.gender === 'female' && moment().add(year.year, 'year').isSame(animal.dateOfDeath, 'year') ),
      bullsSlaughtered: year.animals.filter(animal => animal.status = 'diseased' && animal.cause === 'slaughtered' && animal.gender === 'male' && moment().add(year.year, 'year').isSame(animal.dateOfDeath, 'year') ),
      cowsIllness: year.animals.filter(animal => animal.status = 'diseased' && animal.cause === 'illness' && animal.gender === 'female' && moment().add(year.year, 'year').isSame(animal.dateOfDeath, 'year') ),
      bullsIllness: year.animals.filter(animal => animal.status = 'diseased' && animal.cause === 'illness' && animal.gender === 'male' && moment().add(year.year, 'year').isSame(animal.dateOfDeath, 'year') ),
      newBorns: year.animals.filter(animal => animal.status = 'alive' && moment().add(year.year, 'year').isSame(animal.birthDate, 'year') ),
      newBornsDied: year.animals.filter(animal => animal.status = 'diseased' && animal.cause === 'calving-death' && moment().add(year.year, 'year').isSame(animal.dateOfDeath, 'year') ),
    })
  }); */

  return years;
}

export default useProjection;