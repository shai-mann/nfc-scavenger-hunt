
INSERT INTO clues (id, title, data, nfc_tag_id, order_index)
VALUES ('ed077b47-88cf-42a0-8869-ca1d91ff4a39', 'The Hidden Library', '{"text":"Example Text for the first clue","isCopyable":true}'::jsonb, 'teeheepassword', 1)
ON CONFLICT (id) DO UPDATE
SET title = EXCLUDED.title,
    data = EXCLUDED.data,
    nfc_tag_id = EXCLUDED.nfc_tag_id,
    order_index = EXCLUDED.order_index;

INSERT INTO clues (id, title, data, nfc_tag_id, order_index)
VALUES ('89392397-65b6-47e1-ba78-83446bcd9ef3', 'Secret Garden Path', '{"text":"Example Text for the second clue","isCopyable":false}'::jsonb, 'adifferentpassword', 2)
ON CONFLICT (id) DO UPDATE
SET title = EXCLUDED.title,
    data = EXCLUDED.data,
    nfc_tag_id = EXCLUDED.nfc_tag_id,
    order_index = EXCLUDED.order_index;

INSERT INTO clues (id, title, data, nfc_tag_id, order_index)
VALUES ('babf0130-7e4d-44fa-b555-b33960aea27b', 'The Clock Tower Mystery', '{"text":"Example Text for the third clue","isCopyable":true}'::jsonb, 'anotherpassword', 3)
ON CONFLICT (id) DO UPDATE
SET title = EXCLUDED.title,
    data = EXCLUDED.data,
    nfc_tag_id = EXCLUDED.nfc_tag_id,
    order_index = EXCLUDED.order_index;
