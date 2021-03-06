
window.onload = function() {
    setInterval(update_status, 10000);
    update_status();
};

function update_status() {
    apicall("/api/ansible", function(ret) {
        b1 = document.getElementById("status-provision");

        Object.keys(ret.data.stats).forEach(function(container) {
            const {
                changed,
                failures,
                ok,
                skipped,
                unreachable
            } = ret.data.stats[container];

            if (failures) {
                update_badge(b1, "ansible-" + container, container, "danger");
                navbar_prov_status(container + " failed, see Status.");
            } else {
                update_badge(b1, "ansible-" + container, container + " success", "primary");
            }
        });

        if (ret.running) {
            update_badge(b1, "ansible", "Applying configuration", "primary");
            navbar_prov_status("Applying configuration");
        } else {
            update_badge(b1, "ansible", "Provision idle", "secondary");
        }

    });

    $.get("/stats/;csv", function(csv) {
        b2 = document.getElementById("status-service");

        clear_message();

        csv.split("\n").forEach(line => {
            lf = line.split(",");
            if (lf[0] == "smtp" && lf[1] == "postfix") {
                if(/L7OK/.test(lf[36])) {
                    update_badge(b2, "postfix-health", "Postfix responds", "primary");
                } else {
                    update_badge(b2, "postfix-health", "Postfix is unhealthy", "danger");
                    add_message("Postfix is unhealthy, this server is unable to process both incoming and outgoing e-mails! Backend reported: " + lf[36]);
                }
            } else if (lf[0] == "smtp-tls" && lf[1] == "postfix") {
                if(/L7OK/.test(lf[36])) {
                    update_badge(b2, "postfix-tls-health", "Postfix TLS responds", "primary");
                } else {
                    update_badge(b2, "postfix-tls-health", "Postfix TLS is unhealthy", "danger");
                    add_message("Postfix TLS is unhealthy, you can't read your e-mail and some providers are unable to send messages to you! Backend reported: " + lf[36]);
                }
            } else if (lf[0] == "imap-tls" && lf[1] == "dovecot") {
                if(/L7OK/.test(lf[36])) {
                    update_badge(b2, "dovecot-health", "Dovecot responds", "primary");
                } else {
                    update_badge(b2, "dovecot-health", "Dovecot is unhealthy", "danger");
                    add_message("Dovecot is unhealthy, this server is unable to store emails! Backend reported: " + lf[36]);
                }
            } else if (lf[0] == "sieve" && lf[1] == "sieve") {
                if(/L4OK/.test(lf[36])) {
                    update_badge(b2, "sieve-health", "Sieve responds", "primary");
                } else {
                    update_badge(b2, "sieve-health", "Sieve is unhealthy", "danger");
                    add_message("Sieve is unhealthy. The filter and e-mail rules system is down. Backend reported: " + lf[36]);
                }
            }

        });
    });

    apicall("/fluentd/", function(files) {
        status_logs = document.getElementById("status-logs");

        var latest_file = { time: 0, name: "" };
        files.forEach(file => {
            if(/\.log$/.test(file.name)) {
                if (Date.parse(file.mtime) > latest_file.time) {
                    latest_file.time = Date.parse(file.mtime);
                    latest_file.name = file.name
                }
            }
        });

        $.get("/fluentd/" + latest_file.name, function(logs) {
            var log_list = logs.split("\n").slice(-1024).reverse();
            status_logs.innerHTML = '';
            log_list.forEach(el => {
                p = document.createElement("p");
                p.innerHTML = el;
                status_logs.appendChild(p);
            });
        });
    });

}

function add_message(str) {
    msg = document.getElementById("status-service-messages");
    msg.innerHTML = str + "<br>" + msg.innerHTML;
}

function clear_message() {
    document.getElementById("status-service-messages").innerHTML = '';
}

function update_badge(obj, badge_id, badge_name, badge_type) {
    let badge = document.getElementById("badge-gen-id-" + badge_id);
    if (!badge) {
        badge = document.createElement("span");
        badge.classList.add("badge");
        badge.classList.add("badge-pill");
        badge.id = "badge-gen-id-" + badge_id;
        badge.style.marginBottom = "0.4em";
        badge.style.marginRight = "0.4em";
        badge.style.fontSize = "120%";
        obj.appendChild(badge);
    }

    ["primary", "secondary", "success", "danger",
    "warning", "info", "light", "dark"].forEach(e => {
        if (e != badge_type) {
            badge.classList.remove("badge-" + e);
        }
    });
    badge.classList.add("badge-" + badge_type);
    
    badge.innerText = badge_name;
}

function remove_badge(badge_id) {
    let badge = document.getElementById("badge-gen-id-" + badge_id);
    if (badge) {
        badge.remove();
    }
}
