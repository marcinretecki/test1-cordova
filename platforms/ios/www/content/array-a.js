function arrayA(no, returnLength) {
  var array = [
    {
      "s": [
        ["Jeg", "heter", "Asgar"]
      ],
      "t": "Nazywam się Asgar."
    },
    {
      "s": [
        ["Han", "heter", "Jon"]
      ],
      "t": "On nazywa się Jon."
    },
    {
      "s": [
        ["Hun", "heter", "Emma"]
      ],
      "t": "Ona nazywa się Emma."
    },
    {
      "s": [
        ["De", "heter", "Adam og Sara"]
      ],
      "t": "Oni nazywają się Adam i Sara."
    },
    {
      "s": [
        ["hvor", "kommer", "du", "fra", "?"]
      ],
      "t": "Skąd pochodzisz?"
    },
    {
      "s": [
        ["kommer", "du", "og", "din", "kone", "fra", "norge", "?"],
        ["kommer", "din", "kone", "og", "du", "fra", "norge", "?"]
      ],
      "t": "Czy Ty i Twoja żona pochodzicie z Norwegii?",
      "b": "kommer"
    },
    {
      "s": [
        ["Morbi", "leo", "risus", "porta", "ac", "consectetur", "vestibulum"]
      ],
      "t": "Skąd pochodzisz?"
    },
    {
      "s": [
        ["hvor", "kommer", "du", "fra", "?"]
      ],
      "t": "Skąd pochodzisz?"
    },
    {
      "s": [
        ["hvor", "kommer", "du", "fra", "?"]
      ],
      "t": "Skąd pochodzisz?"
    },
    {
      "s": [
        ["hvor", "kommer", "du", "fra", "?"]
      ],
      "t": "Skąd pochodzisz?"
    },
    {
      "s": [
        ["hvor", "kommer", "du", "fra", "?"]
      ],
      "t": "Skąd pochodzisz?"
    },
    {
      "s": [
        ["hvor", "kommer", "du", "fra", "?"]
      ],
      "t": "Skąd pochodzisz?"
    },
    {
      "s": [
        ["hvor", "kommer", "du", "fra", "?"]
      ],
      "t": "Skąd pochodzisz?"
    },
    {
      "s": [
        ["hvor", "kommer", "du", "fra", "?"]
      ],
      "t": "Skąd pochodzisz?"
    },
    {
      "s": [
        ["hvor", "kommer", "du", "fra", "?"]
      ],
      "t": "Skąd pochodzisz?"
    },
    {
      "s": [
        ["hvor", "kommer", "du", "fra", "?"]
      ],
      "t": "Skąd pochodzisz?"
    },
    {
      "s": [
        ["hvor", "kommer", "du", "fra", "?"]
      ],
      "t": "Skąd pochodzisz?"
    }
  ];

  if (returnLength) {
    return array.length;
  } else if (no >= 0) {
    return array[no];
  }
}