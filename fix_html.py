
js = open('app.js', 'r', encoding='utf-8').read()

# Fix rupee symbol (shown as ?)
js = js.replace(
    '<span class="cart-item-price">?${item.price * item.qty}</span>',
    '<span class="cart-item-price">\u20b9${item.price * item.qty}</span>'
)
js = js.replace(
    'document.getElementById("cartTotal").textContent = "?" + total;',
    'document.getElementById("cartTotal").textContent = "\u20b9" + total;'
)
js = js.replace(
    'msg += `\u2022 ${item.name} (${item.variant}) x${item.qty} = ?${item.price * item.qty}\\n`;',
    'msg += `\u2022 ${item.name} (${item.variant}) x${item.qty} = \u20b9${item.price * item.qty}\\n`;'
)
js = js.replace(
    'msg += `\\n*Total: ?${total}*\\n\\nPlease confirm availability and delivery. Thank you!`;',
    'msg += `\\n*Total: \u20b9${total}*\\n\\nPlease confirm availability and delivery. Thank you!`;'
)

# Fix trash icon (shown as ???)
js = js.replace(
    '<button class="remove-btn" onclick="removeFromCart(\'${item.key}\')">???</button>',
    '<button class="remove-btn" onclick="removeFromCart(\'${item.key}\')">\u2715</button>'
)

# Fix toast checkmark (shown as ?)
js = js.replace(
    't.textContent = "? " + message;',
    't.textContent = "\u2705 " + message;'
)

open('app.js', 'w', encoding='utf-8').write(js)
print("app.js fixed!")
