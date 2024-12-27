import {getItem} from '@/system/store/localstorage';
import router from '@/system/engine/router';

export default{
    install: (app) => {
        app.config.globalProperties.$p = {
            permissionVue(){
                var permission={
					//dashboard
					'dashboard':'RZYSSQ',

					'accountPassword': 'GZDNII',
					'accountSecurity': 'TRBQR6',
					'accountGoogle': 'BSZPQA',

					//app
					'app':'1D13C2',

					'mediaGalleryAdd': 'CNEGUQ',
					'mediaGalleryUpload': 'CJ88L2',
					'mediaGalleryDelete': '5JL64Z',

					'developerPasswordSearch': 'DLUWTP',
					
					'developerPermissionAdd': 'RZYSSQ',
					'developerPermissionEdit': 'RZYSSQ',
					'developerPermissionDelete': 'RZYSSQ',

					'developerPermissionAgentAdd': 'MKT47J',
					'developerPermissionAgentEdit': 'KJYBR3',
					'developerPermissionAgentDelete': 'CDQSKD',

					'developerRestoreData': 'IK8ZFC',
					'developerRestorePermission': 'CPMSKO',

					'developerRedisData': '9UB5R4',

					'toolSystemEdit':'B9BGN1',
					'toolSystemPage':'NMB4PP',

					'toolSettingAdd': 'HJ4WAG',
					'toolSettingEdit': 'WRIW1K',
					'toolSettingDelete': '8CFUXG',

					'toolBonusEdit': 'ZT2C7F',

					'toolRankAdd': 'KPM7PP',
					'toolRankEdit': 'QTTLC7',
					'toolRankDelete': 'BJ8CFX',

					'toolBadgeAdd': 'BUDOPA',
					'toolBadgeEdit': '6FYF7F',
					'toolBadgeDelete': 'JGHFIO',
					'toolBadgeUpload': 'BUDOPA',

					'toolRoleAdd': 'RZYSSQ',
					'toolRoleEdit': 'RZYSSQ',
					'toolRolePermission': 'RZYSSQ',
					'toolRoleDelete': 'RZYSSQ',

					'toolRoleAgentAdd': '493BNJ',
					'toolRoleAgentEdit': '43MKWZ',
					'toolRoleAgentPermission': 'XOV19J',
					'toolRoleAgentDelete': '26E3KH',
					'toolRoleAgentStatus': 'YI7S9D',

					'toolAccountAdd': 'PQJBAI',
					'toolAccountEdit': 'JTNH1R',
					'toolAccountDelete': 'K4LY36',

					'toolEventAdd': 'RC84O1',
					'toolEventEdit': 'KNLQ5E',
					'toolEventDelete': 'IVJ7X2',
					'toolEventAgentPermission': 'RZYSSQ',
					'toolEventAgentDelete': 'RZYSSQ',

					'toolPageAdd': '1KU2JB',
					'toolPageEdit': 'XV8DNI',
					'toolPageDelete': 'RGQYD9',

					'toolStatusAdd': 'I3QAY8',
					'toolStatusEdit': '96FZW7',
					'toolStatusDelete': 'LOXV9Q',

					'toolAttributeAdd': 'O5M3ZI',
					'toolAttributeEdit': 'UTAOAP',
					'toolAttributeDelete': 'XZ4FTS',

					'toolCoinAdd': 'FLMGZQ',
					'toolCoinEdit': 'JVTKZ1',
					'toolCoinDelete': '5WHUYC',

					'toolWalletAdd': 'SPERVY',
					'toolWalletEdit': '473GT5',
					'toolWalletDelete': 'JHZLXA',
					'toolWalletCache':'OALWEF',
					'toolWalletCacheClear':'LG2QH6',

					'toolNotificationAdd': '7LZGGP',
					'toolNotificationEdit': 'HPGVAF',
					'toolNotificationDelete': '7YWEBE',
					'toolNotificationStatus': 'DDAKQI',

					'toolBonusPaymentAdd': 'T9ESIX',
					'toolBonusPaymentEdit': '216GX4',
					'toolBonusPaymentDelete': 'ZO9LQJ',

					'toolSystemPaymentAdd': '1QG9O2',
					'toolSystemPaymentEdit': '6ZRK4A',
					'toolSystemPaymentDelete': '551OER',
					'toolSystemPaymentStatus': 'Z1GTV2',

					'toolPaymentAdd': 'JD2AV4',
					'toolPaymentEdit': 'WW5QC1',
					'toolPaymentDelete': 'DQ8GQ2',
					'toolPaymentStatus': '783Q4T',
					'toolPaymentAdmin': 'BG5IO5',
					'toolPaymentMember': '3JT5LJ',

					'toolLanguageAdd': 'NRIKGK',
					'toolLanguageEdit': 'PSOZKN',
					'toolLanguageDelete': 'VH3O5S',

					'toolDepositAdd': 'PCZGA7',
					'toolDepositEdit': 'SPVNXK',
					'toolDepositDelete': '7EFTVX',
					'toolDepositStatus': '66WT1K',

					'toolEmailAdd': 'RAK3H2',
					'toolEmailEdit': 'OUKOPW',
					'toolEmailDelete': 'LZPJDH',

					'toolCountryAdd': 'SR2EBL',
					'toolCountryEdit': 'PDGBL6',
					'toolCountryDelete': 'SVEN6E',
					'toolCountryStatus': '6IRHNG',

					'toolMailChannelAdd': 'IIHKQW',
					'toolMailChannelEdit': 'HD3UPI',
					'toolMailChannelDelete': 'LN28R2',

					'toolMailServerAdd': 'C4ZXZ9',
					'toolMailServerEdit': 'VWKAL1',
					'toolMailServerDelete': 'NRW82F',

					'toolBrowserAdd': '9CASTF',
					'toolBrowserEdit': '8WB2H8',
					'toolBrowserDelete': 'D6BA3P',

					'toolDeviceAdd': '2LARNI',
					'toolDeviceEdit': '76XL78',
					'toolDeviceDelete': 'LRXHEG',

					'toolNetworkAdd': 'VUOU8G',
					'toolNetworkEdit': 'BZAOEK',
					'toolNetworkDelete': 'PUZQW8',
					'toolNetworkStatus': 'VXBCBG',

					'toolMemberPackageAdd': 'LIP9RN',
					'toolMemberPackageEdit': 'UILFQE',
					'toolMemberPackageDelete': 'B39O3A',


					//management
					'management':'N4AUT5',

					'adminAdminAdd': '83GLOK',
					'adminAdminEdit': 'Y2HE8B',
					'adminAdminDelete': '2L2O5L',
					'adminAdminPermission': 'B17ZWR',
					'adminAdminPassword': 'HR5KIW',
					'adminAdminSecurity': 'AGJULW',
					'adminAdminStatus': 'W8YHUC',

					'adminAgentAdd': 'T9AUG2',
					'adminAgentEdit': 'SNPSW9',
					'adminAgentDelete': 'KY4X6N',
					'adminAgentPassword': 'PFGBQN',
					'adminAgentSecurity': 'CQHMN2',
					'adminAgentPermission': '2F24XR',
					'adminAgentStatus': '69V4BS',

					'adminAssistantAdd': 'SJV9G9',
					'adminAssistantEdit': 'HQNCOV',
					'adminAssistantDelete': '58FEZR',
					'adminAssistantPassword': '7QZFZP',
					'adminAssistantSecurity': 'KJ3JN5',
					'adminAssistantStatus': 'ANQNGA',

					'managementMerchant': 'XJPNNO',
					'merchantMerchant': 'AWGXXE',
					'merchantMerchantAdd': 'ZPW5UA',
					'merchantMerchantEdit': 'TRJAZJ',
					'merchantMerchantDelete': 'M6MFF3',

					'managementSticker': '7L4BR7',
					'stickerList': 'UH1QB6',
					'stickerListAdd': 'JRK5ZI',
					'stickerListEdit': 'LSIICZ',
					'stickerListDelete': 'A1ZCLG',

					'stickerGroup': '1C541H',
					'stickerGroupAdd': 'VTQQNG',
					'stickerGroupEdit': 'SP6WCZ',
					'stickerGroupDelete': 'LSB6ZJ',

					'userContact': 'IV5KP6',
					'userContactAdd': 'ARVXT3',
					'userContactEdit': 'VHXL78',
					'userContactDelete': '8DYH1K',

					'userMemberRealTopupDeduct': 'KY5BWQ',
					'userMemberRealEdit': '5O3J9A',
					'userMemberRealReset': '8Z52U6',
					'userMemberRealPassword': 'YW7NIK',
					'userMemberRealSecurity': 'YGX64D',
					'userMemberRealStatus': 'ON3N58',

					'userMemberAdd': 'M8MSI9',
					'userMemberEdit': 'HX2ZYT',
					'userMemberReset': 'BWFL3P',
					'userMemberPassword': 'LDUMFF',
					'userMemberSecurity': 'W58WIP',
					'userMemberStatus': 'Y7WMCJ',
					'userMemberLogin': 'E4NULB',
					'userMemberTransaction': '8YBHP2',
					'userMemberApprove': 'SGKNG6',
					'userMemberDeposit': 'U1L8B1',
					'userMemberWalletSync': 'PH97BU',
					'userMemberExport': '3ODMOB',
					'userMemberExportList': '8BKCFA',
					'userMemberExportDelete': '5JJ7BB',
					'userMemberMultipleAction': 'SZHVY8',
					'userMemberCheckPassword': 'WRHTT4',

					'userPublicEdit': 'IBXBE3',

					'userSpecialAdd': '3CDZV5',
					'userSpecialEdit': 'CP3QP7',
					'userSpecialDelete': 'FU5EMK',

					'userRankAdd': 'HWJQNW',
					'userRankDelete': 'RSWD67',
					'userRankExport': 'Q3J6ZN',
					'userRankExportList': 'V2353D',
					'userRankExportDelete': 'XIO4C2',

					'userBankAdd': '151YDI',
					'userBankEdit': '181U74',
					'userBankDelete': 'RYVFHQ',

					'userDepositAddressEdit': '23L3R7',
					'userDepositAddressDelete': 'WVWG9J',

					'userWithdrawAddressEdit': '23L3R7',
					'userWithdrawAddressDelete': 'WVWG9J',

					'userNetworkInfo': 'MSVDM1',
					'userNetworkChange': 'MONUMC',
					'userNetworkExport': 'RZFJRY',
					'userNetworkExportList': 'OQ2ZQI',
					'userNetworkExportDelete': '354JNG',

					'profileInformationEdit': 'QMSN1J',
					
					'serviceTypeAdd': '5RMBTP',
					'serviceTypeEdit': '3QZVOA',
					'serviceTypeDelete': '3HSROQ',
					'serviceTypeStatus': 'WCNL1Z',
					

					'serviceTicketingInfo': 'VVJL2A',
					'serviceTicketingAdd': 'HMXWJS',
					'serviceTicketingComplete': 'C3XZ7E',
					'serviceTicketingTrash': 'AP5X18',
					'serviceTicketingDelete': '67CPOR',

					'userChat':'G6Q9SH',
					'userChatRole':'XZHCG9',
					'userChatRoleAdd':'XG1RYA',
					'userChatRoleEdit':'QN9UPG',
					'userChatRoleDelete':'P39Y4S',
					'userChatLog':'NPJW2E',
					'userChatLogAdd':'1RLIB2',
					'userChatLogEdit':'3L1YQE',
					'userChatLogDelete':'MEPJO6',
					'userChatGroup':'IESJ42',
					'userChatGroupAdd':'3881II',
					'userChatGroupEdit':'Y5DWJ4',
					'userChatGroupDelete':'PC4P3X',

					//financial
					'financial':'GTVSXP',
					'financialTransactionExport':'67EGGT',
					'financialTransactionExportList':'3KR22D',
					'financialTransactionExportDelete':'KIIX9P',
					'financialTransactionDelete':'1MUD5S',

					'financialBonusExport':'D91BFM',
					'financialBonusExportList':'HDFSQ4',
					'financialBonusExportDelete':'M4G7ZK',

					'financialBankWithdrawEdit':'R7MUAN',
					'financialBankWithdrawExport':'ETA9ES',
					'financialBankWithdrawImport':'UY9R4S',
					'financialBankWithdrawExportList':'NEB36L',
					'financialBankWithdrawExportDelete':'E6B7YA',

					'financialCoinWithdrawEdit':'8VMWWP',
					'financialCoinWithdrawExport':'EIVOMD',
					'financialCoinWithdrawImport':'V4UK5E',
					'financialCoinWithdrawExportList':'4JOUAA',
					'financialCoinWithdrawExportDelete':'Z5NNJR',

					'financialDepositEdit':'IYGPXP',
					'financialDepositDelete':'3TOPC2',
					'financialDepositExport':'VYM721',
					'financialDepositExportList':'FZPM1B',
					'financialDepositExportDelete':'LK1G89',

					'financialWithdrawEdit':'IYMP2U',
					'financialWithdrawComplete':'GNKVQD',
					'financialWithdrawReject':'BJ8BZE',
					'financialWithdrawExport':'XNPYD2',
					'financialWithdrawExportList':'M5LBTD',
					'financialWithdrawExportDelete':'FAK9RA',
					

					//member

					'memberManageListAdd':'YTCSXE',
					'memberManageListEdit':'CYQCBG',
					'memberManageListDelete':'PHFLXH',
					'memberManageListExport':'RWIBGT',
					'memberManageListPassword':'33HBGI',
					'memberManageListSecurity':'VKG8P7',

					//package
					'package':'S7ACRO',
					'packageManage': 'CTIBUZ',
					'packageManageList': '863KM8',
					'packageManageListAdd': 'UFLQ2T',
					'packageManageListEdit': 'B4US7J',
					'packageManageListDelete': 'HXTMPQ',
					'packageSettingCategoryAdd':'648O72',
					'packageSettingCategoryEdit':'RZQGA8',
					'packageSettingCategoryDelete':'XJNVPA',
					'packageSettingCategoryStatus':'CDCBUL',

					'packageSettingTypeAdd':'SW2GA3',
					'packageSettingTypeEdit':'1LA61O',
					'packageSettingTypeDelete':'9Q41V6',
					'packageSettingTypeStatus':'TAISJV',

					'packageSettingPackageCategoryAdd':'SAI511',
					'packageSettingPackageCategoryEdit':'FAMSPT',
					'packageSettingPackageCategoryDelete':'MAEUOQ',
					'packageSettingPackageCategoryStatus':'TUULRU',

					'packageSettingProductAdd':'CIM3R5',
					'packageSettingProductEdit':'9JYZG4',
					'packageSettingProductDelete':'GD6VK2',
					'packageSettingProductStatus':'ZVSNOD',
					'packageSettingProductCopy':'MZR6H1',

					'packageSettingCode':'IWMFCQ',
					'packageSettingCodeAdd':'Y821CW',
					'packageSettingCodeDelete':'29KA9O',
					'packageSettingCodeExport':'AWOG74',
					'packageSettingCodeExportList':'U4OCIW',
					'packageSettingCodeExportDelete':'ETDGOQ',

					'packageSettingCardAdd':'FILN9G',
					'packageSettingCardEdit':'DOMVK2',
					'packageSettingCardDelete':'RZ51YP',

					'packageListsExport':'MV22HL',
					'packageListsExportList':'QOSILB',
					'packageListsExportDelete':'G84NWT',
					'packageListsItem':'IY2L71',

					'packageProductMerchantAdd':'ES4AAT',
					'packageProductMerchantEdit':'PDSN45',
					'packageProductMerchantDelete':'LJZKOQ',
					'packageProductMerchantStatus':'NYWRGC',

					'packageProductItemAdd':'FAVRVR',
					'packageProductItemEdit':'53RLZF',
					'packageProductItemDelete':'TGTP5M',
					'packageProductItemStatus':'5DDTMV',

					//site
					'site':'RZYSSQ',
					'内容管理':'RZYSSQ',
					
					'contentCarousel': 'SSK3ED',
					'contentCarouselAdd': 'KA51DP',
					'contentCarouselEdit': 'GJ3W4M',
					'contentCarouselDelete': 'PDNLGZ',

					'contentNews': 'KGTBNM',
					'contentNewsAdd': '1CT1IY',
					'contentNewsEdit': 'TTSWYH',
					'contentNewsDelete': 'JEH8MC',

					'galleryListsAdd':'RZYSSQ',
					'galleryListsUpload':'RZYSSQ',
					'galleryListsDelete':'RZYSSQ',

					'siteGalleryCenterAdd':'RZYSSQ',
					'siteGalleryCenterEdit':'RZYSSQ',
					'siteGalleryCenterDelete':'RZYSSQ',

					'mediaNewsAdd':'X75BU5',
					'mediaNewsEdit':'22DFM6',
					'mediaNewsDelete':'4H5OOY',
					'mediaNewsStatus':'YUZ58M',

					'mediaArticleAdd':'PUR8FE',
					'mediaArticleEdit':'17CYYJ',
					'mediaArticleDelete':'DCT5BS',
					'mediaArticleStatus':'8S9CBT',

					'chat':'MDSCXC',
					'chatManageMember':'ZXPBW9',
					'chatManageReply':'1TZULG',
					'chatManageAddCategory':'RZMBCL',
					'chatManageEditCategory':'6S2699',
					'chatManageDeleteCategory':'J8QIGM',
					'chatManageAddReply':'KDUEAR',
					'chatManageEditReply':'E6EHVP',
					'chatManageDeleteReply':'MFG14C',
					'chatManageBan':'9SLGSF',
					'chatManageRename':'VIG8NO',

				};

                return permission;
            },
            permissionChecker(permissionValue,route){
                if(getItem('authSignToken')){
                    var permissionList = JSON.parse(getItem('permissionList'));
                    var permission = this.permissionVue();

                    if(permissionValue != "" && route == "class"){
                        if(permissionList.includes(permission[permissionValue])){
                            return '';
                        }else{
                            return 'permission_block';
                        }
                    }else if(route != undefined && route != "" && route != " " && route != null){
                        if(permissionList.includes(permission[permissionValue])){
                            router.push(route);
                        }
                    }else if(permissionValue != ""){
                        if(permissionList.includes(permission[permissionValue])){
                            return true;
                        }else{
                            return false;
                        }
                    }
                }else{
                    return true;
                }
            }
        }
    }
}
