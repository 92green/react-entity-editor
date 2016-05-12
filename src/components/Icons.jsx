import classnames from 'classnames';

function getUnicodeCharacter(cp) {
    if (cp >= 0 && cp <= 0xD7FF || cp >= 0xE000 && cp <= 0xFFFF) {
        return String.fromCharCode(cp);
    }
    else if (cp >= 0x10000 && cp <= 0x10FFFF) {
        cp -= 0x10000;
        var first = ((0xffc00 & cp) >> 10) + 0xD800;
        var second = (0x3ff & cp) + 0xDC00;
        return String.fromCharCode(first) + String.fromCharCode(second);
    }
}

function Icon(props) {
    var {size, iconSet} = props;
    var code = iconSet[size];

    return <span
        className={classnames('Icon', `Icon-${size}`, props.className)}
        data-icon={getUnicodeCharacter(parseInt(code, 16))}
    />;
}

Icon.defaultProps = {
    size: 'normal',
    iconSet: {normal: 'E001', small: 'E001'}
}



//
// Exports
//
export const IconAward =        (props) => <Icon {...props} iconSet={{normal: 'e333' }} />;
export const IconClipboard =    (props) => <Icon {...props} iconSet={{normal: 'e030'}} />;
export const IconClock =        (props) => <Icon {...props} iconSet={{normal: 'e055', small: 'e023'}} />;
export const IconDocument =     (props) => <Icon {...props} iconSet={{normal: 'e037', small: 'e022'}} />;
export const IconPerson =       (props) => <Icon {...props} iconSet={{normal: 'e004', small: 'e008'}} />;
export const IconPlus =         (props) => <Icon {...props} iconSet={{normal: '002B', small: '002B'}} />;
export const IconQrcode =       (props) => <Icon {...props} iconSet={{normal: 'e259', small: 'e039'}} />;
export const IconTag =          (props) => <Icon {...props} iconSet={{normal: 'e067', small: 'e042'}} />;
export const IconTelevision =   (props) => <Icon {...props} iconSet={{normal: 'e087' }} />;
export const IconThumbsUp =     (props) => <Icon {...props} iconSet={{normal: 'e344' , small: 'e125'}} />;
export const IconTechnical =    (props) => <Icon {...props} iconSet={{normal: 'E281'}} />;



// export default {
//     approval:       ['E085',          'E085'        ],
//     bomb:           ['e290'                         ],
//     burger:         ['E159',          'E159'        ],
//     calendar:       ['E046',          'E109'        ],
//     camera:         ['\ud83d\udcf7',    '\ud83d\udcf7'  ],
//     chevronback:    ['E225',          'E079'        ],
//     chevronforward: ['E224',          'E080'        ],
//     circleinfo:     ['E196',          'E086'        ],
//     circleminus:    ['E192'                         ],
//     circletick:     ['E194',          'E084'        ],
//     clock:          ['E055',          'E023'        ],
//     clouddownload:  ['E364',          'E364'        ],
//     cloudupload:    ['E365',          'E198'        ],
//     cog:            ['E137',          'E019'        ],
//     comment:        ['E246',          'E111'        ],
//     conversation:   ['E245'                         ],
//     cross:          ['E208',          'E014'        ],
//     cycle:          ['E082',          'E031'        ],
//     decision:       ['E423'                         ],
//     edit:           ['\u270F',          '\u270F'    ],
//     ellipsis:       ['E188'                         ],
//     end:            ['E192'                         ],
//     envelope:       ['\u2709'                       ],
//     eye:            ['E052',          'E105'        ],
//     fastForward:    ['E177',          'E075'        ],
//     file:           ['E037',          'E022'        ],
//     film:           ['E009'                         ],
//     filter:         ['E321'                         ],
//     folder:         ['E441',          'E117'        ],
//     fullscreen:     ['E216'                         ],
//     grid:           ['E157',          'E011'        ],
//     group:          ['E044',                        ],
//     inbox:          ['E131',          'E028'        ],
//     keyboard:       ['E270'                         ],
//     lightening:     ['E242',          'E162'        ],
//     list:           ['E115',          'E012'        ],
//     logout:         ['E388',          'E163'        ],
//     megaphone:      ['E356',          'E122'        ],
//     minus:          ['\u2212',          '\u2212'     ],
//     muted:          ['E183',          'E036'        ],
//     no:             ['E200',          'E090'        ],
//     paperclip:      ['\ud83d\udcce',    '\ud83d\udcce'  ],
//     pause:          ['E175'                           ],
//     person:         ['E004',          'E008'        ],
//     play:           ['E174',          'E174'        ],
//     plus:           ['\u002B',          '\u002B'        ],
//     print:          ['E016'                           ],
//     qrcode:         ['E259',          'E039'        ],
//     rabbit:         ['\ud83d\udc07'                     ],
//     sampler:        ['E328'                           ],
//     search:         ['E028',          'E003'        ],
//     share:          ['E223',          'E095'        ],
//     share_alt:      ['E309'                           ],
//     sort:           ['E404'                           ],
//     start:          ['E174'                           ],
//     table:          ['E120'                           ],
//     tag:            ['E067',          'E042'        ],
//     task:           ['E359'                           ],
//     thumbsdown:     ['E345',          'E126'        ],
//     tick:           ['E207',           'E013'        ],
//     trash:          ['E017',          'E020'        ],
//     undo:           ['E222'                           ],
//     unfullscreen:   ['E215'                           ],
//     unmuted:        ['E185',          'E038'        ],
//     weights:        ['E357'                           ],
//     warning:        ['E079'                           ],
//     world:          ['E371',          'E135'        ]
// };
