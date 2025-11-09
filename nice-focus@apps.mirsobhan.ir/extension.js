/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */
import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import GLib from "gi://GLib";

export default class PlainExampleExtension extends Extension {
	enable() {
		this._previousPid = null;

		this._signalHandler = global.display.connect(
			"focus-window",
			(d, window, p) => {
				if (!window) return;

				const currentPid = window.get_pid();

				if (_previousPid === currentPid) return;

				if (this._previousPid && this._previousPid !== currentPid) {
					this._reniceProcessTree(this._previousPid, 19);
				}

				this._reniceProcessTree(currentPid, -10);

				this._previousPid = currentPid;
			},
		);
	}

	disable() {
		if (this._signalHandler) {
			global.display.disconnect(this._signalHandler);
			this._signalHandler = null;
		}
	}

	_reniceProcessTree(pid, niceValue) {
		const cmd =
			"pstree -p ${pid} | grep -oP '\\(\\K\\d+(?=\\))' | xargs -r renice ${niceValue} -p";

		try {
			GLib.spawn_command_line_async(cmd);
		} catch (e) {
			logError(e, `Failed to renice process tree for PID ${pid}`);
		}
	}
}
