const mongoose = require('mongoose');

const vetResearchSchema = new mongoose.Schema({
  test: {
    type: String,
    enum: ['blood', 'urine', 'ficies']
  },
  //////////////////////////////////
  bloodTest: {
    wbc: {
      value: String,
      russianName: {
        type: String,
        default: 'Количество лейкоцитов'
      }
    },
    lym: {
      value: String,
      russianName: {
        type: String,
        default: 'Процентное соотношение лимфоцитов'
      }
    },
    mon: {
      value: String,
      russianName: {
        type: String,
        default: 'Процентное соотношение моноцитов'
      }
    },
    gra: {
      value: String,
      russianName: {
        type: String,
        default: 'Процентное соотношение гранулоцитов'
      }
    },
    rbc: {
      value: String,
      russianName: {
        type: String,
        default: 'Количество эритроцитов'
      }
    },
    mcv: {
      value: String,
      russianName: {
        type: String,
        default: 'Средний объём эритроцитов'
      }
    },
    mch: {
      value: String,
      russianName: {
        type: String,
        default: 'Среднее содержание гемоглобина в эритроците'
      }
    },
    mchc: {
      value: String,
      russianName: {
        type: String,
        default: 'Средняя концентрация гемоглобина в эритроцитах'
      }
    },
    hgb: {
      value: String,
      russianName: {
        type: String,
        default: 'Уровень гемоглобина'
      }
    },
    hct: {
      value: String,
      russianName: {
        type: String,
        default: 'Гематокрит'
      }
    },
    plt: {
      value: String,
      russianName: {
        type: String,
        default: 'Количество тромбоцитов'
      }
    },
  },
  //////////////////////////////////
  //////////////////////////////////
  //////////////////////////////////
  //////////////////////////////////
  //////////////////////////////////
  //////////////////////////////////
  //////////////////////////////////
  urineTest: {
    volume: {
      value: String,
      russianName: {
        type: String,
        default: 'Количество мочи'
      }
    },
    color: {
      value: String,
      russianName: {
        type: String,
        default: 'Цвет мочи'
      }
    },
    transparency: {
      value: String,
      russianName: {
        type: String,
        default: 'Прозрачность мочи'
      }
    },
    odor: {
      value: String,
      russianName: {
        type: String,
        default: 'Запах мочи'
      }
    },
    specificGravity: {
      value: String,
      russianName: {
        type: String,
        default: 'Удельный вес мочи'
      }
    },
    pH: {
      value: String,
      russianName: {
        type: String,
        default: 'pH мочи'
      }
    },
    protein: {
      value: String,
      russianName: {
        type: String,
        default: 'Белок мочи'
      }
    },
    glucose: {
      value: String,
      russianName: {
        type: String,
        default: 'Глюкоза мочи'
      }
    },
    ketoneBodies: {
      value: String,
      russianName: {
        type: String,
        default: 'Кетоновые тела мочи'
      }
    },
    yellowPigments: {
      value: String,
      russianName: {
        type: String,
        default: 'Желтые пигменты мочи'
      }
    },
    redBloodCells: {
      value: String,
      russianName: {
        type: String,
        default: 'Эритроциты мочи'
      }
    },
    leukocytes: {
      value: String,
      russianName: {
        type: String,
        default: 'Лейкоциты мочи'
      }
    },
    epithelialCells: {
      value: String,
      russianName: {
        type: String,
        default: 'Эпителиальные клетки мочи'
      }
    },
    casts: {
      value: String,
      russianName: {
        type: String,
        default: 'Цилиндры мочи'
      }
    },
    crystals: {
      value: String,
      russianName: {
        type: String,
        default: 'Кристаллы мочи'
      }
    },
    biochemicalProperties: {
      value: String,
      russianName: {
        type: String,
        default: 'Биохимические свойства мочи'
      }
    },
  },
  //////////////////////////////////
  //////////////////////////////////
  //////////////////////////////////
  //////////////////////////////////
  //////////////////////////////////
  //////////////////////////////////
  //////////////////////////////////
  ficiesTest: {
    formAndConsistency: {
      value: String,
      russianName: {
        type: String,
        default: 'Форма и консистенция кала'
      }
    },
    color: {
      value: String,
      russianName: {
        type: String,
        default: 'Цвет кала'
      }
    },
    odor: {
      value: String,
      russianName: {
        type: String,
        default: 'Запах кала'
      }
    },
    undigestedFoodResidues: {
      value: String,
      russianName: {
        type: String,
        default: 'Непереваренные остатки пищи'
      }
    },
    visibleParasites: {
      value: String,
      russianName: {
        type: String,
        default: 'Видимые паразиты'
      }
    },
    mucus: {
      value: String,
      russianName: {
        type: String,
        default: 'Слизь'
      }
    },
    bloodAndExudate: {
      value: String,
      russianName: {
        type: String,
        default: 'Кровь и экссудат'
      }
    },
    hydrogenIndex: {
      value: String,
      russianName: {
        type: String,
        default: 'Водородный показатель'
      }
    },
    reactionForDetectionOfOccultBlood: {
      value: String,
      russianName: {
        type: String,
        default: 'Реакция на скрытую кровь'
      }
    },
    stercobilin: {
      value: String,
      russianName: {
        type: String,
        default: 'Стеркобилин'
      }
    },
    bilirubin: {
      value: String,
      russianName: {
        type: String,
        default: 'Билирубин'
      }
    },
    detritus: {
      value: String,
      russianName: {
        type: String,
        default: 'Детрит'
      }
    },
    contentOfDigestedOrUndigestedMuscleFibersAndConnectiveTissue: {
      value: String,
      russianName: {
        type: String,
        default: 'Содержание переваренных или непереваренных мышечных волокон и соединительной ткани'
      }
    },
    epithelium: {
      value: String,
      russianName: {
        type: String,
        default: 'Эпителий'
      }
    },
    plantFiber: {
      value: String,
      russianName: {
        type: String,
        default: 'Растительная клетчатка'
      }
    },
    neutralFatAndFattyAcids: {
      value: String,
      russianName: {
        type: String,
        default: 'Нейтральный жир и жирные кислоты'
      }
    },
    starch: {
      value: String,
      russianName: {
        type: String,
        default: 'Крахмал'
      }
    },
    crystals: {
      value: String,
      russianName: {
        type: String,
        default: 'Кристаллы'
      }
    },
    erythrocytes: {
      value: String,
      russianName: {
        type: String,
        default: 'Эритроциты'
      }
    },
    leukocytes: {
      value: String,
      russianName: {
        type: String,
        default: 'Лейкоциты'
      }
    },
    parasites: {
      value: String,
      russianName: {
        type: String,
        default: 'Паразиты'
      }
    },
    helminthEggs: {
      value: String,
      russianName: {
        type: String,
        default: 'Яйца гельминтов'
      }
    },
    microflora: {
      value: String,
      russianName: {
        type: String,
        default: 'Микрофлора'
      }
    },

  },
  vetR: {
    type: mongoose.Schema.ObjectId,
    ref: 'Vet'
  },
  farm: {
    type: mongoose.Schema.ObjectId,
    ref: 'Farm'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  animal: {
    type: mongoose.Schema.ObjectId,
    ref: 'Animal'
  },
  note: String,
  date: Date,
  creationDate: {
    type: Date,
    default: Date.now()
  }
});

const VetResearch = mongoose.model('VetResearch', vetResearchSchema);
module.exports = VetResearch;