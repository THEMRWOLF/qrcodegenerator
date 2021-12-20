// Codigo funete https://github.com/datalog/qrcode-svg
(function () {
  const $ = element => document.querySelector(element);

  const valores = {
    box: $('#box'),
    txt: $('#msg'),

    set: $('#set'),
    op1: $('#op1'),
    op2: $('#op2'),

    in1: $('#in1'),
    in2: $('#in2'),
    in3: $('#in3'),
    in4: $('#in4'),
    in5: $('#in5'),
    in6: $('#in6'),
  };

  const current = (o) => {
    o._value = o.value;
  };

  const updated = (o) => {
    return o._value == o.value;
  };

  const clear = (o) => {
    while (o.childNodes[0]) {
      o.removeChild(o.childNodes[0]);
    }
  };

  const hint = (d) => {
    console.log(
      'Mensaje (msg): ' + d.msg + '\n' +
      'Dimensiones (dim): ' + d.dim + '\n' +
      'Padding (pad): ' + d.pad + '\n' +
      'Patron (mtx): ' + d.mtx + '\n' +
      'ecl: ' + d.ecl + '\n' +
      'ecb: ' + d.ecb + '\n' +
      'Paleta (pal): ' + d.pal + '\n' +
      'Verbose (vrb): ' + d.vrb + '\n'
    );
  };

  const download = (d) => {
    const replace = (d, r) => {
      return d.replace(new RegExp(Object.keys(r).join('|'), 'gi'), function (m) {
        return r[m];
      });
    }
    var d = replace(d, {
      'M ': 'M',
      ' M ': 'M',
      ' V ': 'V',
      ' v ': 'v',
      ' H ': 'H',
      ' h ': 'h',
      ' Z': 'Z',
      ' z': 'z',
      ' />': '/>',
      '></path>': ' /> ',
      'svg xmlns="http://www.w3.org/2000/svg"': 'svg'
    });
    var n = 'qrcode-' + replace(new Date().toISOString().slice(0, 19), {
      ':': '',
      '-': ''
      // 'T': '-'
    }) + '.svg';
    var b = new Blob([d], { type: 'image/svg+xml' });
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(b, n);
    } else {
      const a = document.createElement('a');
      const u = URL.createObjectURL(b);

      a.href = u;
      a.download = n;

      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(u);
      }, 0);
    }
    return false;
  };

  op1.onclick = () => {
    valores.set.className = 'show';
    return false;
  };

  op2.onclick = () => {
    valores.set.className = 'hide';
    return false;
  };

  valores.in1.onchange =
    valores.in2.onchange =
    valores.in3.onchange =
    valores.in4.onchange =
    valores.in5.onchange =
    valores.in6.onchange =
    () => {
      valores.box.update();
    };

  valores.in5.onchange = () => {
    valores.in6.checked = true;
    valores.box.update();
  };

  valores.txt.onkeyup = () => {
    if (updated(valores.txt)) return;
    valores.box.update();
    current(valores.txt);
  };

  valores.box.update = () => {
    clear(valores.box);
    const check = (element, first, last, input, defaultValue) => {
      if (element.value >= first && element.value <= last) {
        return element.value;
      } else {
        element.value = defaultValue;
        window.alert(input + ' fuera de rango ' + first + ' - ' + last);
        return defaultValue;
      }
    }
    const data = {
      msg: valores.txt.value,
      dim: check(valores.in1, 256, 61440, 'Dimesion', 256),
      pad: check(valores.in2, 0, 10, 'Padding', 3),
      mtx: check(valores.in3, -1, 7, 'Pattern', -1),
      ecl: 'H',
      ecb: 1,
      pal: [valores.in4.value, valores.in6.checked && valores.in5.value],
      vrb: 0
    };

    valores.box.appendChild(QRCode(data))
      .onclick = () => {
        return download(valores.box.innerHTML);
      };

    hint(data);
  };

  current(valores.txt);
  valores.box.update();
  valores.txt.focus();
})();
