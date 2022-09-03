db:gdut_db
table:nft_property
        代币hash     nft作者    nft名字    nft文件名   是否流通  
value: token_id   nft_author  nft_name     cid      status
//说明
status：1->流通 0->不流通 

table:nft_to_check
       nft文件名    nft名字     nft作者     nft发行量    审批人     nft状态   价格    已购买数量
value:   cid      nft_name   nft_author  nft_amount  approver   status  price  quantity_purchased
//说明
status: 0->待审核 1->通过 2->已发行 -1->没通过

table: nft_owner
       拥有者   代币id
value: owner  token_id

table: nft_account
       用户账号   用户地址
value: account   addres